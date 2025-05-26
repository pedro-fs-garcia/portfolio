import 'dotenv/config'; // carrega .env automaticamente
import fs from 'fs/promises';
import mysql from 'mysql2/promise';

dotenv.config()

export async function getPortfolio() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    // Obter todos os projetos
    const [projects] = await connection.execute(`SELECT * FROM projects`);

    // Para cada projeto, buscar dados relacionados
    const exportData = [];

    for (const project of projects) {
        const [keywords] = await connection.execute(`
            SELECT k.keyword FROM keywords k
            JOIN project_keywords pk ON k.id = pk.keyword_id
            WHERE pk.project_id = ?
        `, [project.id]);

        const [technologies] = await connection.execute(`
            SELECT t.technology FROM technologies t
            JOIN project_technologies pt ON t.id = pt.technology_id
            WHERE pt.project_id = ?
        `, [project.id]);

        const [features] = await connection.execute(`
            SELECT f.feature FROM features f
            JOIN project_features pf ON f.id = pf.feature_id
            WHERE pf.project_id = ?
        `, [project.id]);

        // Monta objeto no formato original
        exportData.push({
            id: project.id,
            name: project.name,
            github: project.github,
            image: project.image,
            description: project.description,
            desafios: project.desafios,
            solucoes: project.solucoes,
            aprendizados: project.aprendizados,
            status: project.status,
            completionDate: project.completionDate 
                ? new Date(project.completionDate).toISOString().slice(0, 10).split('-').reverse().join('-') 
                : null,
            palavras_chave: keywords.map(k => k.keyword),
            technologies: technologies.map(t => t.technology),
            features: features.map(f => f.feature)
        });
    }

    await connection.end();
    return exportData;
}


export async function getContactInfo() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [rows] = await connection.execute('SELECT * FROM contact_info LIMIT 1');

    await connection.end();

    return rows[0]; // Retorna o primeiro (e presumivelmente único) registro
}
