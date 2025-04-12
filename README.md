# Portfólio Acadêmico

Um portfólio acadêmico desenvolvido com Node.js, Express e EJS para apresentar projetos e trajetória acadêmica.

## Tecnologias Utilizadas

- Node.js
- Express
- EJS (Embedded JavaScript Templates)
- CSS3

## Estrutura do Projeto

```
meu-portfolio/
├── public/
│   └── css/
│       └── style.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   └── projetos.ejs
├── app.js
├── package.json
└── README.md
```

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```
4. Para desenvolvimento com auto-reload:
   ```bash
   npm run dev
   ```

O servidor estará rodando em `http://localhost:3000`

## Personalização

Para personalizar o portfólio:

1. Edite os dados no arquivo `app.js` na seção `portfolioData`
2. Modifique os estilos no arquivo `public/css/style.css`
3. Ajuste os templates EJS na pasta `views/`

## Licença

Este projeto está sob a licença MIT. 