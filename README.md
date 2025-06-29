# Documentação do Projeto

## Visão Geral
Este projeto é composto por dois principais módulos:

1. **Backend**: Responsável por fornecer APIs e serviços para o frontend.
2. **Frontend**: Interface do usuário que consome as APIs do backend.

## Estrutura do Projeto

### Backend

Localizado na pasta `backend/`, o backend é construído utilizando Node.js e Express. Ele contém os seguintes arquivos e diretórios:

- **docker-compose.yml**: Arquivo de configuração para orquestração de containers Docker.
- **Dockerfile**: Define a imagem Docker para o backend.
- **package.json**: Lista as dependências e scripts do projeto.
- **src/**: Contém o código-fonte do backend.
  - **app.js**: Configuração principal do aplicativo.
  - **server.js**: Inicialização do servidor.
  - **controllers/**: Contém os controladores, como `politicianController.js`.
  - **routes/**: Define as rotas da API, como `api.js`.
  - **services/**: Serviços que encapsulam lógica de negócios, como `chamberService.js`, `openAIService.js` e `senateService.js`.
  - **utils/**: Utilitários auxiliares, como `apiUtils.js`.

- **SWAGGER**: deve-se acessar o link `http://localhost:3001/api-docs/#/` para ver a documentação detalhada de cada endpoint.

### Frontend

Localizado na pasta `frontend/`, o frontend é construído utilizando React e Vite. Ele contém os seguintes arquivos e diretórios:

- **bun.lockb**: Arquivo de lock do Bun.
- **components.json**: Configuração de componentes.
- **index.html**: Arquivo HTML principal.
- **package.json**: Lista as dependências e scripts do projeto.
- **postcss.config.js**: Configuração do PostCSS.
- **tailwind.config.ts**: Configuração do Tailwind CSS.
- **tsconfig.json**: Configuração do TypeScript.
- **vite.config.ts**: Configuração do Vite.
- **public/**: Arquivos públicos, como `favicon.ico` e `robots.txt`.
- **src/**: Contém o código-fonte do frontend.
  - **App.tsx**: Componente principal do aplicativo.
  - **components/**: Contém componentes reutilizáveis, como `ChatInterface.tsx`, `PoliticianInfo.tsx` e `PoliticianSelector.tsx`.
  - **hooks/**: Hooks personalizados, como `use-mobile.tsx` e `use-toast.ts`.
  - **lib/**: Biblioteca de utilitários, como `utils.ts`.
  - **pages/**: Páginas do aplicativo, como `Index.tsx` e `NotFound.tsx`.

## Configuração do Ambiente

### Backend

1. Certifique-se de ter o Node.js instalado.
2. Navegue até a pasta `backend/`.
3. Renomeie o arquivo .env.example para .env e coloque a chave da OPEN AI.
4. Execute o comando:

   ```bash
   npm install
   ```

   ```bash
   npm start
   ```

4. O backend estará disponível em `http://localhost:3001`.

### Frontend

1. Certifique-se de ter o Node.js instalado.
2. Navegue até a pasta `frontend/`.
3. Instale as dependências:

   ```bash
   npm install
   ```

4. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. O frontend estará disponível em `http://localhost:8080`.

## Funcionalidades

### Backend

- **API de Políticos**: Fornece informações sobre políticos.
- **Serviços de Câmara e Senado**: Integração com APIs externas para dados legislativos.
- **Serviço OpenAI**: Utiliza a API da OpenAI para dar contexto do político selecionado e responder perguntas sobre ele.

### Frontend

- **Interface de Chat**: Permite interação com o sistema.
- **Seleção de Políticos**: Interface para selecionar e visualizar informações de políticos.
- **Componentes Reutilizáveis**: Biblioteca de UI com componentes como botões, tabelas e modais.

## Tecnologias Utilizadas

### Backend
- Node.js
- Express

### Frontend
- React
- Vite
- Tailwind CSS
- TypeScript
