import { IAuthentication } from '../src/_Autenticacao/Interfaces/authInterfaces';
import AuthenticationService from '../src/_Autenticacao/services/authenticationService';
import bcrypt from 'bcrypt';

jest.mock('../src/_Autenticacao/services/authenticationService');

const mockAuthService = AuthenticationService as jest.Mocked<typeof AuthenticationService>;

let mockAuth: IAuthentication;

describe('Authentication Service', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    
        const hashedPassword = await bcrypt.hash('password123', 10);
        mockAuth = {
            id: '123',
            login: 'testuser',
            passwordHash: hashedPassword,
            active: true,
            password_token_reset: null, 
            password_token_expiry_date: null, 
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });
    test('Deveria criar um novo usuário', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);

        mockAuthService.createStandartAuthentication.mockResolvedValue(mockAuth);

        const result = await mockAuthService.createStandartAuthentication({
            login: 'testuser',
            passwordHash: 'password123',
        });

        expect(result).toEqual(mockAuth);
        expect(mockAuthService.createStandartAuthentication).toHaveBeenCalledWith({
            login: 'testuser',
            passwordHash: 'password123',
        });
    });

    test('Deveria autenticar com sucesso', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);

        mockAuthService.authenticate.mockImplementation(async (login, password) => {
            const isPasswordValid = await bcrypt.compare(password, mockAuth.passwordHash);
            return isPasswordValid ? mockAuth : null;
        });

        const result = await mockAuthService.authenticate('testuser', 'password123');

        expect(result).toEqual(mockAuth);
        expect(mockAuthService.authenticate).toHaveBeenCalledWith('testuser', 'password123');
    });

    test('Deveria falhar ao autenticar com senha incorreta', async () => {
        mockAuthService.authenticate.mockResolvedValue(null);

        const result = await mockAuthService.authenticate('testuser', 'wrongpassword');

        expect(result).toBeNull();
        expect(mockAuthService.authenticate).toHaveBeenCalledWith('testuser', 'wrongpassword');
    });
});
