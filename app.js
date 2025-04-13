const express = require('express');
const path = require('path');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Dados globais
const globalData = {
    email: "seu.email@exemplo.com",
    phone: "(00) 00000-0000",
    address: "Sua Cidade, Estado",
    github: "https://github.com/seu-usuario",
    linkedin: "https://linkedin.com/in/seu-usuario",
    instagram: "https://instagram.com/seu-usuario"
};

// Dados dos projetos
const projects = [
    {
        id: 1,
        name: "Projeto 1",
        description: "Descrição detalhada do projeto 1",
        image: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg",
        github: "https://github.com/seu-usuario/projeto1"
    },
    {
        id: 2,
        name: "Projeto 2",
        description: "Descrição detalhada do projeto 2",
        image: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg",
        github: "https://github.com/seu-usuario/projeto2"
    }
];

const meu_nome = "pedro garcia"

// Rotas
app.get('/', (req, res) => {
    res.render('index', { 
        meu_nome: meu_nome
    });
});

app.get('/projetos', (req, res) => {
    res.render('projetos', { 
        global_data: globalData,
        projects: projects
    });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});