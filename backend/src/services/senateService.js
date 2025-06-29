const axios = require('axios');
const xml2js = require('xml2js'); // Para parsing de XML, já que a API do Senado geralmente retorna XML

const BASE_URL = 'https://www12.senado.leg.br/legis/public/api';

/**
 * Converte XML para JSON.
 * @param {string} xmlString
 * @returns {Promise<object>}
 */
const parseXmlToJson = async (xmlString) => {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xmlString, { explicitArray: false, ignoreAttrs: true }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

exports.getSenators = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/senadores`);
        const jsonResult = await parseXmlToJson(response.data);
        return jsonResult.Senadores.ListaSenadores.Senador || [];
    } catch (error) {
        console.error('Erro ao buscar senadores:', error.message);
        throw new Error('Erro ao buscar lista de senadores da API do Senado. Pode ser necessário ajustar o parser XML.');
    }
};

exports.getSenatorDetails = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/senador/${id}`);
        const jsonResult = await parseXmlToJson(response.data);
        return jsonResult.DetalheParlamentar.Parlamentar || {};
    } catch (error) {
        console.error(`Erro ao buscar detalhes do senador ${id}:`, error.message);
        throw new Error(`Erro ao buscar detalhes do senador ${id} da API do Senado.`);
    }
};

exports.getSenatorBills = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/parlamentar/${id}/materias?ano=2024&tipo=1`); // 'tipo=1' geralmente para projetos de lei
        const jsonResult = await parseXmlToJson(response.data);
        // Estrutura pode ser: Materias.Materia
        return jsonResult.Materias?.Materia || [];
    } catch (error) {
        console.error(`Erro ao buscar matérias do senador ${id}:`, error.message);
        return []; // Retorna vazio em caso de erro
    }
};