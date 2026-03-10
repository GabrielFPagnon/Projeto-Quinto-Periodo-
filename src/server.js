import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { oauth2Client, SCOPES, google } from './config/googleConfig.js';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.get('/', (req, res) => {
    res.send('Servidor de Micro-saúde e Foco funcionando! 🚀')
});

app.get('/auth', (req, res) => {
    console.log('Gerando URL de autenticação...');

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent'
    });

    res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
    const { code } = req.query;

    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date().toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: 'startTime',
        });

        const events = response.data.items;

        if (events.length) {
            console.log("Seus próximos 5 eventos:");
            events.forEach((event) => {
                console.log(`- ${event.summary} (${event.start.dateTime || event.start.date})`);
            });
        } else {
            console.log("Ninguém te convidou para nada... Agenda vazia!");
        }

        res.json({
            message: "Login realizado com sucesso!",
            events: events
        });

    } catch (error) {
        console.error('Erro no processo:', error.message);
        res.status(500).send("Erro ao processar agenda.");
    }
});

app.post('/api/sugerir-rotina', async (req, res) => {
    try {
        const { tempoDisponivel, estadoMental, objetivo } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Atue como um especialista em produtividade e micro-saúde mental. 
        O usuário tem ${tempoDisponivel} minutos disponíveis, está se sentindo '${estadoMental}' 
        e seu objetivo principal agora é '${objetivo}'. 
        
        Crie uma rotina de foco estruturada para esse período, incluindo:
        1. Blocos de tempo de trabalho (ex: Pomodoro adaptado ao estado mental).
        2. Sugestões de pausas ativas para micro-saúde (ex: alongamento, respiração).
        Seja direto, prático e retorne em formato de lista.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textoRotina = response.text();

        res.json({ 
            sucesso: true, 
            rotinaSugerida: textoRotina 
        });

    } catch (error) {
        console.error("Erro ao gerar rotina:", error);
        res.status(500).json({ sucesso: false, erro: 'Falha ao comunicar com a IA do Gemini.' });
    }
});

app.listen(PORT, () => {
    console.log(`
        Servidor está online!
        Porta: ${PORT}
        URL : http://localhost:${PORT}
        `)
});