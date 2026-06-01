import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// 1. Importando as rotas separadas
import authRoutes from './routes/authRoutes.js';
import rotinaRoutes from './routes/rotinaRoutes.js'; 

// Ajuste segundo SonarQube
const express = require('express')
const app = express();
app.dissable("x-powered-by");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// 2. Rota de teste simples
app.get('/', (req, res) => {
    res.send('Servidor de Micro-saúde e Foco funcionando!');
});

// 3. Conectando as rotas (Delegação)
app.use('/auth', authRoutes); // Tudo que começar com /auth vai para o authRoutes
app.use('/api', rotinaRoutes); // Tudo que começar com /api vai para o rotinaRoutes

// 4. Iniciando o servidor (apenas UMA vez no final do arquivo)
app.listen(PORT, () => {
    console.log(`
        Servidor está online!
        Porta: ${PORT}
        URL : http://localhost:${PORT}
    `);
});