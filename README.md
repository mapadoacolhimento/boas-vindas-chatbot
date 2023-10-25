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

## Atualização do index da IAna

Para atualizar o índice da "IAna", siga estas etapas. Este processo permite que você atualize o conteúdo que o chatbot "IAna" utiliza para fornecer respostas aos usuários.

**Nota:** A atualização do índice da "IAna" envolve a geração de novos índices com base nos dados contidos na pasta `/data` e a posterior cópia desses índices para um Bucket S3 na AWS. A partir desse Bucket, o chatbot "IAna" acessa os índices para responder a perguntas dos usuários.

### Passo 1: Geração do Novo Índice

Dentro do pacote da API, temos um arquivo chamado `handler.ts`. Neste arquivo, você encontrará uma função chamada `content`. Esta função é responsável por gerar um novo índice com base nos dados contidos na pasta `/data`. A pasta `/data` deve ser criada e preenchida com o conteúdo desejado que você deseja incluir no índice.

### Passo 2: Execução da Função `content`

Para gerar o novo índice, siga estas etapas:

1. Certifique-se de que a pasta `/data` contenha os dados que você deseja incluir no novo índice.

2. Descomente o código relacionado à função `content` no arquivo `serverless.yml` dentro do pacote da API. Isso permitirá que você execute a função localmente.

3. Execute a função `content` para gerar o novo índice. O novo índice será gerado e armazenado na pasta `/storage` dentro do pacote da API.

### Passo 3: Cópia dos Índices para o Bucket S3

Após a geração do novo índice na pasta `/storage`, você precisará copiá-lo manualmente para o Bucket S3 da Amazon. Os índices gerados vivem no Bucket S3 dentro da pasta `vector_index`. Certifique-se de que os novos índices sejam copiados para essa localização no Bucket S3. Os novos index devem ser trocados pelos anteriores, portanto, você deve apagar os index antigos - NÃO deixe o bucket com mais de um index simultaneamente.

### Passo 4: Configuração do Chatbot "IAna"

O chatbot "IAna" está configurado para acessar os índices no Bucket S3 da Amazon. Com os novos índices copiados para o Bucket S3, o chatbot será capaz de fornecer respostas atualizadas com base no novo conteúdo.

Lembre-se de que este processo é manual e não é necessário implantar a função `content` na AWS, pois não é uma operação frequente.

## GitHub Actions

O projeto está configurado com o GitHub Actions para automatizar a integração contínua e a implantação. A pipeline de integração inclui testes e build. Após a aprovação dos testes, a implantação é acionada para ambas as partes do projeto.

- A UI é implantada na plataforma Vercel.
- A API é implantada na AWS Serverless com o uso de Lambdas.
