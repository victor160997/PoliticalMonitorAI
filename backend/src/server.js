require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Backend API rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});