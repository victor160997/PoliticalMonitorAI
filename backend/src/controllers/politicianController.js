const chamberService = require('../services/chamberService');
const senateService = require('../services/senateService');
const openAIService = require('../services/openAIService');
const { cleanText } = require('../utils/apiUtils'); // Para limpar texto, se necessário

// Cache simples em memória para a lista de políticos
let politiciansCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hora em milissegundos

/**
 * Obtém e retorna uma lista combinada de deputados e senadores.
 * Aplica um cache simples para evitar chamadas excessivas às APIs externas.
 */
exports.getAllPoliticians = async (req, res) => {
    if (politiciansCache && (Date.now() - lastCacheUpdate < CACHE_DURATION)) {
        return res.json(politiciansCache);
    }

    try {
        const [deputies] = await Promise.all([
            chamberService.getDeputies(),
        ]);

        const formattedDeputies = deputies.map(dep => ({
            id: `dep-${dep.id}`, // Prefixo para diferenciar de senadores
            name: dep.nome,
            type: 'deputado',
            party: dep.siglaPartido,
            state: dep.siglaUf,
            photoUrl: dep.urlFoto
        }));

        politiciansCache = [...formattedDeputies].sort((a, b) => a.name.localeCompare(b.name));
        lastCacheUpdate = Date.now();

        res.json(politiciansCache);
    } catch (error) {
        console.error('Erro ao obter políticos:', error.message);
        res.status(500).json({ message: 'Erro ao carregar lista de políticos.' });
    }
};

/**
 * Obtém detalhes de um político específico (deputado ou senador).
 * O ID virá prefixado ('dep-' ou 'sen-').
 */
exports.getPoliticianDetails = async (req, res) => {
    const { id } = req.params;
    const [type, politicianId] = id.split('-');

    try {
        let details = {};
        if (type === 'dep') {
            details = await chamberService.getDeputyDetails(politicianId);
            // Aqui você pode adicionar lógica para buscar proposições, votações etc.
            details.proposicoes = await chamberService.getDeputyPropositions(politicianId);
            details.numberOfPropositions = await chamberService.getDeputyNumberOfPropositions(politicianId) ?? details.proposicoes.length;
            details.votacoes = await chamberService.getDeputyVotes(politicianId);
        } else if (type === 'sen') {
            details = await senateService.getSenatorDetails(politicianId);
            // A API do Senado para proposições e votações é mais complexa,
            // considere buscar apenas as mais recentes ou simplificar para o MVP.
            // Exemplo:
            details.materias = await senateService.getSenatorBills(politicianId);
        } else {
            return res.status(400).json({ message: 'ID de político inválido.' });
        }
        res.json(details);
    } catch (error) {
        console.error(`Erro ao obter detalhes do político ${id}:`, error.message);
        res.status(500).json({ message: 'Erro ao carregar detalhes do político.' });
    }
};

/**
 * Processa a pergunta do usuário, busca contexto e envia para a OpenAI.
 */
exports.chatWithPolitician = async (req, res) => {
    const { question, politicianId } = req.body;

    if (!question || !politicianId) {
        return res.status(400).json({ message: 'Pergunta e ID do político são obrigatórios.' });
    }

    const [type, id] = politicianId.split('-');

    try {
        let contextData = {};
        let politicianName = '';

        // 1. Obter informações básicas do político
        if (type === 'dep') {
            const dep = await chamberService.getDeputyDetails(id);
            politicianName = dep.nomeCivil;
            contextData.name = dep.nomeCivil;
            contextData.party = dep.siglaPartido;
            contextData.state = dep.siglaUf;
            contextData.currentSituation = JSON.stringify(dep.ultimoStatus) || 'Não informado';
            contextData.birthDate = dep.dataNascimento || 'Não informado';
            contextData.allInfo = JSON.stringify(dep); // Informações completas em JSON
            // 2. Obter dados mais aprofundados (proposições, votações)
            const proposicoes = await chamberService.getDeputyPropositions(id);
            const votacoes = await chamberService.getDeputyVotes(id);
            contextData.proposicoes = proposicoes.map(p => ({
                titulo: p.ementa,
                url: p.url,
                status: p.statusProcessamento || 'Não informado'
            }));
            contextData.votacoes = votacoes.slice(0, 3).map(v => ({
                sessao: v.resumoVotacao,
                data: v.data
            }));
        } else if (type === 'sen') {
            const sen = await senateService.getSenatorDetails(id);
            politicianName = sen.IdentificacaoParlamentar.NomeCompletoParlamentar;
            contextData.name = sen.IdentificacaoParlamentar.NomeCompletoParlamentar;
            contextData.party = sen.IdentificacaoParlamentar.SiglaPartidoParlamentar;
            contextData.state = sen.IdentificacaoParlamentar.UfParlamentar;
            contextData.currentSituation = sen.Mandato.DescricaoSituacao || 'Não informado';
            const materias = await senateService.getSenatorBills(id);
            contextData.materias = materias.slice(0, 5).map(m => ({
                ementa: m.EmentaMateria,
                tipo: m.DescricaoTipoMateria,
                dataApresentacao: m.DataApresentacao
            }));
        }

        // 3. Formatar o prompt para a OpenAI
        const prompt = `Você é um assistente de IA especialista em política brasileira e deve responder perguntas sobre o político ${politicianName} com base nas informações fornecidas. Use apenas as informações do contexto para responder. Se a informação não estiver no contexto, diga "Não tenho informações sobre isso no momento."

Contexto sobre ${politicianName}:
Nome: ${contextData.name}
Json com informações básicas: ${JSON.stringify(contextData.allInfo)}

${contextData.proposicoes ? `Proposições recentes na Câmara: ${JSON.stringify(contextData.proposicoes, null, 2)}` : ''}
${contextData.votacoes ? `Votações recentes na Câmara: ${JSON.stringify(contextData.votacoes, null, 2)}` : ''}
${contextData.materias ? `Matérias apresentadas no Senado: ${JSON.stringify(contextData.materias, null, 2)}` : ''}

Pergunta do usuário: "${question}"

Responda de forma concisa e direta:`;

        console.log("Prompt enviado à OpenAI:", prompt); // Para depuração

        // 4. Chamar a API da OpenAI
        const aiResponse = await openAIService.getChatCompletion(prompt);
        res.json({ response: aiResponse });

    } catch (error) {
        console.error(`Erro ao processar chat para o político ${politicianId}:`, error);
        res.status(500).json({ message: 'Erro ao processar sua pergunta. Tente novamente mais tarde.', error: error.message });
    }
};