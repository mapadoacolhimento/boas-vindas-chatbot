# boas-vindas-chatbot

Este projeto é um Monorepo que abriga o código-fonte de um chatbot desenvolvido para auxiliar voluntárias que estão passando pelo treinamento no "Mapa do Acolhimento". O chatbot, denominado "IAna", tem o objetivo de responder dúvidas e fornecer suporte durante o treinamento das voluntárias.

## Contexto do Projeto

No contexto do projeto, as voluntárias estão passando por um processo de capacitação que abrange vários módulos. Neste primeiro estágio de implementação, o chatbot "IAna" está focado na resposta a perguntas relacionadas ao módulo de "Serviços Públicos" da capacitação.

O projeto é composto por três principais componentes:

1. **Chat:** Este é o módulo principal do chatbot, onde as voluntárias podem fazer perguntas e receber respostas relacionadas ao módulo de "Serviços Públicos".

2. **Questionário:** O chatbot também é capaz de apresentar um questionário interativo para as voluntárias. O questionário contém perguntas destinadas a ajudar as voluntárias a melhorar suas respostas e conhecimento sobre o módulo.

3. **Feedback:** Após a interação com o chatbot, as voluntárias têm a oportunidade de fornecer feedback sobre sua experiência. Isso é feito atribuindo uma nota de 0 a 5 e inclui comentários que ao final são salvos no banco de dados.

## Objetivos do Projeto

O objetivo principal deste projeto é criar uma ferramenta de suporte para as voluntárias em treinamento, proporcionando-lhes respostas eficazes às suas perguntas, oportunidades de aprendizado por meio do questionário e a possibilidade de avaliar a experiência com o chatbot.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

- `ui/`: Contém o código da interface do usuário desenvolvida com Next.js.
- `api/`: Contém o código da API Serverless que utiliza Lambdas na AWS.

## Instalação

Para instalar as dependências do projeto, utilize o PNPM. Certifique-se de que você tenha o PNPM instalado em seu sistema. Você pode instalá-lo com o seguinte comando:

```bash
npm install -g pnpm
```

Depois de ter o PNPM instalado, navegue até a raiz do projeto e execute o seguinte comando para instalar as dependências:

```bash
pnpm install
```

## Executando Localmente

Para executar o código localmente, você precisará configurar um arquivo `.env` tanto no pacote da API quanto no pacote da UI. Certifique-se de que o arquivo `.env` contenha as variáveis de ambiente necessárias. Aqui estão as instruções para rodar localmente:

## Configuração

### Executando o projeto

1. Certifique-se que ambos os pacotes (`ui` e `api`) possuem seus respectivos arquivos `.env`

2. Execute o seguinte comando para iniciar o projeto localmente:
   ```bash
   pnpm run dev
   ```

### Executando a UI:

1. Execute o seguinte comando para iniciar a UI localmente:
   ```bash
   pnpm --filter ui run dev
   ```

A UI estará disponível em:

- `http://localhost:3000` para acessar o chat principal.
- `http://localhost:3000/assessment` para acessar o questionário.
- `http://localhost:3000/feedback` para acessar o chat de feedback.

#### Roteamento no Next.js

Na UI, fizemos algumas personalizações no roteamento para mapear os endpoints da API. Os endpoints são acessados nas seguintes rotas:

- `http://localhost:3000/api/chat`
- `http://localhost:3000/api/chat/assessment`
- `http://localhost:3000/api/chat/feedback`

### Executando a API:

1. Execute o seguinte comando para iniciar a API localmente:
   ```bash
   pnpm --filter api run dev
   ```

A API estará disponível em:

- `http://localhost:5000/dev` com as respectivas rotas configuradas no arquivo `serverless.yml`.

## GitHub Actions

O projeto está configurado com o GitHub Actions para automatizar a integração contínua e a implantação. A pipeline de integração inclui testes e build. Após a aprovação dos testes, a implantação é acionada para ambas as partes do projeto.

- A UI é implantada na plataforma Vercel.
- A API é implantada na AWS Serverless com o uso de Lambdas.
