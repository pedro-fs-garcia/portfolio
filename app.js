import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const app = express();

// Corrigindo __dirname para módulos ES (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurando EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servindo arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const globalData = await getContactInfo();
const projects = await getPortfolio();
import { getPortfolio, getContactInfo, salvarMensagem } from './exportPortfolio.js';

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

app.get('/projeto/:id', async (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return res.status(404).send('Projeto não encontrado');
    }
    const contact = await getContactInfo();
    res.render('descricao_projeto', {
        global_data: contact,
        project: project
    });
});


app.get('/ler_mensagens', async (req, res) => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const [rows] = await connection.execute('SELECT id, nome, email, mensagem FROM mensagens ORDER BY id DESC');
        await connection.end();

        res.render('mensagens', { mensagens: rows, global_data: globalData });
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        res.status(500).send('Erro ao buscar mensagens');
    }
});

app.delete('/exclui_mensagem/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [result] = await connection.execute('DELETE FROM mensagens WHERE id = ?', [id]);
        await connection.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Mensagem não encontrada.' });
        }

        res.status(200).json({ message: 'Mensagem excluída com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir mensagem:', err);
        res.status(500).json({ error: 'Erro ao excluir a mensagem.' });
    }
});


app.post('/mensagens', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await salvarMensagem(name, email, message);
        res.status(200).json({ message: 'Mensagem salva com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar mensagem:', err);
        res.status(500).json({ error: 'Erro ao salvar a mensagem' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});