const axios = require('axios');

const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';

exports.getDeputies = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/deputados?ordenarPor=nome`);
        return response.data.dados;
    } catch (error) {
        console.error('Erro ao buscar deputados:', error.message);
        throw new Error('Erro ao buscar lista de deputados da API da Câmara.');
    }
};

exports.getDeputyDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/deputados/${id}`);
        return response.data.dados;
    } catch (error) {
        console.error(`Erro ao buscar detalhes do deputado ${id}:`, error.message);
        throw new Error(`Erro ao buscar detalhes do deputado ${id} da API da Câmara.`);
    }
};

exports.getDeputyPropositions = async (id) => {
    try {
        // Buscando as 5 proposições mais recentes
        const response = await axios.get(`${BASE_URL}/proposicoes?itens=50&ordem=DESC&idDeputadoAutor=${id}`);
        return response.data.dados;
    } catch (error) {
        console.error(`Erro ao buscar proposições do deputado ${id}:`, error.message);
        return []; // Retorna vazio em caso de erro para não quebrar o chat
    }
};

exports.getDeputyNumberOfPropositions = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/proposicoes?itens=1&ordem=DESC&idDeputadoAutor=${id}`);
        const links = response.data.links;
        const lastHref = links.find(l => l.rel === 'last')?.href;
        const pagina = parseInt(lastHref?.match(/pagina=(\d+)/)?.[1], 10) || 1;
        return pagina ?? null;
    } catch (error) {
        console.error(`Erro ao buscar proposições do deputado ${id}:`, error.message);
        return null;
    }
};

exports.getDeputyVotes = async (id) => {
    try {
        // Buscando as 3 últimas votações (pode ser necessário ajustar o endpoint ou lógica para votações realmente significativas)
        const response = await axios.get(`${BASE_URL}/deputados/${id}/votacoes?itens=3&ordem=DESC&ordenarPor=dataRegistro`);
        return response.data.dados;
    } catch (error) {
        console.error(`Erro ao buscar votações do deputado ${id}:`, error.message);
        return []; // Retorna vazio em caso de erro
    }
};