import { jest } from '@jest/globals';

const mockGenerateAuthUrl = jest.fn();

//Mock
jest.unstable_mockModule('../src/config/googleConfig.js', () => ({
    oauth2Client: {
        generateAuthUrl: mockGenerateAuthUrl
    },
    SCOPES: ['perfil', 'email', 'calendario'],
    google: {
        calendar: jest.fn()
    }
}));

const { gerarUrlLogin } = await import('../src/controllers/authController');

describe('authController - gerarUrlLogin', () => {

    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();

        //Reset
        req = {};
        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    // Validação de login - positivo.
    it('deve gerar a URL do Google e redirecionar o usuário com sucesso', () => {
        //Arrange
        const urlFalsa = 'https://accounts.google.com/login-falso';
        mockGenerateAuthUrl.mockReturnValue(urlFalsa);

        //Act
        gerarUrlLogin(req, res);

        //Assert
        expect(mockGenerateAuthUrl).toHaveBeenCalledWith({
            access_type: 'offline',
            scope: ['perfil', 'email', 'calendario'],
            prompt: 'consent'
        });
        expect(res.redirect).toHaveBeenCalledWith(urlFalsa);
        expect(res.redirect).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled(); //Para não retornar o erro
    });

    // Validação de login - negativa.
    it('deve retornar erro 500 se o Google falhar ao gerar a URL', () => {
        //Arrange
        mockGenerateAuthUrl.mockImplementation(() => {
            throw new Error('Configurações ausentes ou inválidas');
        });

        //Mantém o terminal limpo
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        //Act
        gerarUrlLogin(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            erro: 'Falha ao iniciar o processo de autenticação.'
        });
        expect(res.redirect).not.toHaveBeenCalled();


        consoleSpy.mockRestore();
    });
});