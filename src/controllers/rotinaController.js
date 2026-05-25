import { GoogleGenerativeAI } from '@google/generative-ai'; 

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const sugerirRotina = async (req, res) => {
    try {
        const { tempoDisponivel, estadoMental, objetivo } = req.body;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
};