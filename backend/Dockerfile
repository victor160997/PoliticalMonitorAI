# Usa uma imagem Node.js oficial, leve e recomendada para produção
FROM node:20-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /

# Copia os arquivos de configuração de dependências
# Isso aproveita o cache do Docker: se package.json não mudar,
# as dependências não serão reinstaladas em cada build.
COPY package.json package-lock.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código-fonte da aplicação para o contêiner
COPY . .

# Expõe a porta em que a aplicação Express vai escutar.
# Certifique-se de que esta porta corresponde à PORT definida em seu .env
EXPOSE 3001

# Comando para iniciar a aplicação Node.js.
# 'npm start' deve ser configurado no seu package.json para rodar 'node src/server.js'
CMD ["npm", "start"]