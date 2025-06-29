/**
 * Limpa e sanitiza texto para ser usado em prompts ou exibição.
 * @param {string} text
 * @returns {string}
 */
exports.cleanText = (text) => {
    if (typeof text !== 'string') return '';
    return text.replace(/\s+/g, ' ').trim(); // Remove múltiplos espaços e quebras de linha
};