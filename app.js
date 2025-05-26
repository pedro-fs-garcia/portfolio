const express = require('express');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

const globalData = require('./public/global_data.json');
const projects = require('./public/projects.json');
const { getPortfolio } = require('./exportPortfolio');

app.get('/', (req, res) => {
    res.render('index', { 
        global_data: globalData,
    });
});

app.get('/projetos', async (req, res) => {
    const contact = await getContactInfo();
    const projects = await getPortfolio();
    res.render('projetos', { 
        global_data: contact,
        projects // agora é um array válido
    });
});

app.get('/projeto/:id', (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
        return res.status(404).send('Projeto não encontrado');
    }
    
    res.render('descricao_projeto', { 
        global_data: globalData,
        project: project
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});