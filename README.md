# Tutorial para Executar o Projeto

Este tutorial guia você através dos passos para executar o projeto localmente.

## Passo 1: Clonar o Repositório

1.  Acesse o repositório do projeto no GitHub.
2.  No canto superior direito, clique no botão "**Code**" e copie a URL do repositório.
3.  Abra o seu terminal (ou Git Bash) e clone o repositório em sua máquina local com o seguinte comando:

    ```bash
    git clone https://github.com/iphmm/fitness-system.git
    ```

    **Exemplo:**

    ```bash
    git clone [https://github.com/iphmm/fitness-system.git](https://github.com/iphmm/fitness-system.git)
    ```

4.  Entre na pasta do projeto:

    ```bash
    cd fitness-system
    ```

## Passo 2: Configurar o Ambiente

### Instalar o Node.js

1.  Verifique se o Node.js está instalado executando os seguintes comandos no seu terminal:

    ```bash
    node -v
    npm -v
    ```

2.  Caso não tenha o Node.js instalado, baixe e instale a versão LTS no site [nodejs.org](https://nodejs.org/). O `npm` (Node Package Manager) é instalado automaticamente com o Node.js.

### Instalar as dependências do projeto

1.  Na pasta raiz do projeto (onde se encontra o arquivo `package.json`), execute o seguinte comando para instalar todas as dependências listadas:

    ```bash
    npm install
    ```

## Passo 3: Executar o Back-end (API)

### Configurar o banco de dados com Prisma

1.  Se você ainda não configurou o banco de dados utilizando o Prisma, inicialize-o com o seguinte comando:

    ```bash
    npx prisma migrate dev --name init
    ```

    Este comando irá criar as tabelas no seu banco de dados com base no esquema definido no arquivo `schema.prisma`.

### Rodar o servidor Back-end

1.  Para iniciar o servidor back-end, utilize o comando:

    ```bash
    node index.js
    ```

2.  Se o projeto estiver configurado para usar o `nodemon` (que reinicia o servidor automaticamente ao salvar as alterações), você pode usar o seguinte comando:

    ```bash
    npm run dev
    ```

3.  O servidor back-end será iniciado e estará rodando na porta `3000`. Você pode acessar a API através do seu navegador ou utilizando ferramentas como [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/).

## Passo 4: Executar o Front-end (React)

### Acesse a pasta do Front-end

1.  Se o código do front-end estiver em uma pasta separada (e não na raiz do repositório), navegue até essa pasta no seu terminal. Por exemplo, se a pasta se chamar `fitness-front`:

    ```bash
    cd fitness-front
    ```

2.  Instale as dependências do front-end executando o seguinte comando:

    ```bash
    npm install
    ```

### Rodar o Front-end

1.  Para iniciar o servidor de desenvolvimento do React, execute o comando:

    ```bash
    npm run dev
    ```

2.  O servidor do React será iniciado e, geralmente, estará disponível na porta `5173`. Você poderá acessar o front-end no seu navegador através da seguinte URL:

    ```
    http://localhost:5173
    ```

3.  O front-end irá fazer requisições para a API do back-end para buscar e exibir as informações, como a lista de produtos.

## Passo 5: Testar a Aplicação

1.  Utilize o [Insomnia](https://insomnia.rest/) ou [Postman](https://www.postman.com/) para testar as rotas da API do back-end:

    * **Adicionar um novo produto:**
        * **Método:** `POST`
        * **URL:** `http://localhost:3000/products`
        * **Corpo (JSON):**

            ```json
            {
              "name": "Whey Protein",
              "price": 100.00,
              "stockQuantity": 50
            }
            ```

    * **Listar os produtos cadastrados:**
        * **Método:** `GET`
        * **URL:** `http://localhost:3000/products`

2.  No seu navegador, ao acessar `http://localhost:5173`, a página do front-end deverá exibir a lista de produtos que foram adicionados através da API.

## Passo 6: Próximos Passos

* **Adicionar novas funcionalidades:** Considere adicionar novos endpoints na API para funcionalidades como cadastrar vendas (`POST /sales`) e agendar serviços (`POST /services`).
* **Desenvolver a interface de usuário:** Crie formulários no front-end utilizando React para permitir que os usuários cadastrem novos produtos e agendem serviços de forma interativa.
* **Deploy:** Após garantir que a aplicação está funcionando corretamente no seu ambiente local, planeje o deploy para um ambiente de produção. Algumas plataformas populares incluem [Vercel](https://vercel.com/) para o front-end e [Heroku](https://www.heroku.com/) para o back-end.

## Dicas Finais

* **Git:** Mantenha o seu repositório atualizado e registre suas alterações com commits regulares:

    ```bash
    git add .
    git commit -m "Adiciona funcionalidade X"
    git push origin main
    ```

* **Documentação:** Consulte a documentação oficial das tecnologias utilizadas no projeto para obter informações mais detalhadas e avançadas:
    * [Express.js](https://expressjs.com/pt-br/) (para o back-end)
    * [Prisma](https://www.prisma.io/docs/) (para o ORM)
    * [React](https://react.dev/) (para o front-end)
