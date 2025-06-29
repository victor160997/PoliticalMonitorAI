const express = require('express');
const router = express.Router();
const politicianController = require('../controllers/politicianController');

/**
 * @swagger
 * /api/politicians:
 *   get:
 *     summary: Obtém a lista de políticos (Câmara e Senado).
 *     responses:
 *       200:
 *         description: Lista de políticos obtida com sucesso.
 */
router.get('/politicians', politicianController.getAllPoliticians);

/**
 * @swagger
 * /api/politicians/{id}:
 *   get:
 *     summary: Obtém detalhes de um político específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do político.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do político obtidos com sucesso.
 */
router.get('/politicians/:id', politicianController.getPoliticianDetails);

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Envia uma pergunta para o chat com a IA sobre determinado político.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: Pergunta do usuário.
 *               politicianId:
 *                 type: string
 *                 description: ID do político.
 *     responses:
 *       200:
 *         description: Resposta da IA obtida com sucesso.
 */
router.post('/chat', politicianController.chatWithPolitician);

module.exports = router;