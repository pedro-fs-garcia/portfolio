const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
    const jsonData = JSON.parse(fs.readFileSync('projects.json', 'utf8'));

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    for (const project of jsonData) {
        const formattedDate = project.completionDate
            ? project.completionDate.split('-').reverse().join('-')  // dd-mm-aaaa → aaaa-mm-dd
            : null;

        // Inserir projeto
        await connection.execute(`
            INSERT INTO projects (id, name, github, image, description, desafios, solucoes, aprendizados, status, completionDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = VALUES(name)
        `, [
            project.id,
            project.name,
            project.github,
            project.image,
            project.description,
            project.desafios,
            project.solucoes,
            project.aprendizados,
            project.status,
            formattedDate
        ]);

        // Função para inserir valores únicos e obter o ID
        const insertUnique = async (table, column, value) => {
            const [rows] = await connection.execute(
                `SELECT id FROM ${table} WHERE ${column} = ?`, [value]);
            if (rows.length > 0) return rows[0].id;

            const [result] = await connection.execute(
                `INSERT INTO ${table} (${column}) VALUES (?)`, [value]);
            return result.insertId;
        };

        // Inserir keywords
        if (project.palavras_chave) {
            for (const kw of project.palavras_chave) {
                const kwId = await insertUnique('keywords', 'keyword', kw);
                await connection.execute(`
                    INSERT IGNORE INTO project_keywords (project_id, keyword_id)
                    VALUES (?, ?)
                `, [project.id, kwId]);
            }
        }

        // Inserir technologies
        if (project.technologies) {
            for (const tech of project.technologies) {
                const techId = await insertUnique('technologies', 'technology', tech);
                await connection.execute(`
                    INSERT IGNORE INTO project_technologies (project_id, technology_id)
                    VALUES (?, ?)
                `, [project.id, techId]);
            }
        }

        // Inserir features
        if (project.features) {
            for (const feat of project.features) {
                const featId = await insertUnique('features', 'feature', feat);
                await connection.execute(`
                    INSERT IGNORE INTO project_features (project_id, feature_id)
                    VALUES (?, ?)
                `, [project.id, featId]);
            }
        }
    }

    console.log("Dados importados com sucesso!");
    await connection.end();
}

main().catch(err => console.error("Erro:", err));
