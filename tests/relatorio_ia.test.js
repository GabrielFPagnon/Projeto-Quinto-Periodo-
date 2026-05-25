import { jest } from '@jest/globals';

//Variavel mockada
const mockGenerateContent = jest.fn();

//Mock
jest.unstable_mockModule('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
            getGenerativeModel: jest.fn().mockReturnValue({
                generateContent: mockGenerateContent
            })
        }))
    };
});

const { sugerirRotina } = await import('../src/controllers/rotinaController');

describe('rotinaController - sugerirRotina', () => {

    //Simulando um usuário
    const req = {
        body: { tempoDisponivel: 30, estadoMental: 'cansado', objetivo: 'estudar' }
    };

    let res;

    beforeEach(() => {
        jest.clearAllMocks();

        //Reset
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    //Relatório da API do Gemini - positivo.
    it('deve gerar uma rotina com sucesso e retornar status 200', async () => {
        //Arrange
        mockGenerateContent.mockResolvedValue({
            response: { text: jest.fn().mockReturnValue('1. Foco 25 min\n2. Pausa 5 min') }
        });

        //Act
        await sugerirRotina(req, res);

        //Assert
        expect(res.json).toHaveBeenCalledWith({
            sucesso: true,
            rotinaSugerida: '1. Foco 25 min\n2. Pausa 5 min'
        });
        expect(res.status).not.toHaveBeenCalledWith(500);
    });

    //Relatório da API do Gemini - negativo.
    it('deve retornar erro 500 quando a API do Gemini falhar', async () => {
        // Arrange
        mockGenerateContent.mockRejectedValue(new Error('API Offline ou Timeout'));

        //Mantém o terminal limpo
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        //Act
        await sugerirRotina(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            sucesso: false,
            erro: 'Falha ao comunicar com a IA do Gemini.'
        });


        consoleSpy.mockRestore();
    });
});