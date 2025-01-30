// OAuthFactory.ts
import { IOAuth2Strategy } from '../Interfaces/authInterfaces';
import GoogleOAuthStrategy  from './OAuth2Strategy/OAuthGoogle';

function createOAuth2Strategy(provider: string): IOAuth2Strategy {
    switch (provider.toLowerCase().trim()) {
        case 'google':
            return GoogleOAuthStrategy;

        default:
            throw new Error(`Provedor OAuth2 não suportado: ${provider}`);
    }
}

export {
    createOAuth2Strategy
} 