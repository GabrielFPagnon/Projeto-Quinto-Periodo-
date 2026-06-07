import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/authRoutes.js';
import rotinaRoutes from './routes/rotinaRoutes.js'; 

const app = express();
app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/api', (req, res) => {
    res.send('Servidor de Micro-saúde e Foco funcionando!');
});

//Conectando as rotas (Delegação)
app.use('/api/auth', authRoutes); // Tudo que começar com /auth vai para o authRoutes
app.use('/api/rotinas', rotinaRoutes); // Tudo que começar com /api vai para o rotinaRoutes

//Iniciando o servidor (apenas UMA vez no final do arquivo)
app.listen(PORT, () => {
    console.log(`
        Servidor está online!
        Porta: ${PORT}
        URL : http://localhost:${PORT}
    `);
});