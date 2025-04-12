const express = require('express');
const path = require('path');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Dados do portfólio (pode ser movido para um arquivo separado posteriormente)
const portfolioData = {
  nome: 'Seu Nome',
  titulo: 'Portfólio Acadêmico',
  sobre: 'Breve descrição sobre você e seus objetivos acadêmicos.',
  projetos: [
    {
      titulo: 'Projeto 1',
      descricao: 'Descrição do projeto 1',
      tecnologias: ['Tecnologia 1', 'Tecnologia 2']
    },
    {
      titulo: 'Projeto 2',
      descricao: 'Descrição do projeto 2',
      tecnologias: ['Tecnologia 3', 'Tecnologia 4']
    }
  ]
};

// Rotas
app.get('/', (req, res) => {
  res.render('index', { portfolio: portfolioData });
});

app.get('/projetos', (req, res) => {
  res.render('projetos', { portfolio: portfolioData });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 