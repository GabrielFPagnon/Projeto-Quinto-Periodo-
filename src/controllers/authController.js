import { oauth2Client, SCOPES } from '../config/googleConfig';

export const gerarUrlLogin = (req, res) => {
    try {
        console.log('Gerando URL de autenticação...');
        
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
            prompt: 'consent'
        });
        
        res.redirect(url);
    } catch (error) {
        console.error('Erro ao gerar URL do Google:', error.message);
        res.status(500).json({ erro: 'Falha ao iniciar o processo de autenticação.' });
    }
};

export const callbackGoogle = async (req, res) => {
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

};