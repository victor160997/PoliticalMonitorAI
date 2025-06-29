const OpenAI = require('openai');

// Inicializa o cliente OpenAI com a chave da API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.getChatCompletion = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "Você é um assistente de IA focado em política brasileira, fornecendo informações precisas e imparciais com base nos dados fornecidos."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500, // Limite para o tamanho da resposta da IA
            temperature: 0.7, // Controla a criatividade da resposta (0.0 a 1.0)
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao chamar a API da OpenAI:', error.message);
        if (error.response) {
            console.error('Dados do erro OpenAI:', error.response.data);
        }
        throw new Error('Não foi possível obter resposta da IA. Verifique sua chave da OpenAI ou os limites de uso.');
    }
};