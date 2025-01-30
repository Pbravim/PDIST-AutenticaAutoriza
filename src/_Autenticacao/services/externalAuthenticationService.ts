import HttpError from "../../utils/customErrors/httpError";
import { IAuthentication, IExternalAuthentication, IExternalAuthenticationRepository, IExternalAuthenticationService } from "../Interfaces/authInterfaces";
import ExternalAuthentication from "../models/externalAuthenticationModel";
import { createExternalAuthenticationRepository } from "../repositories/factoryAuthenticationRepository";

class ExternalAuthenticationService implements IExternalAuthenticationService {
    private static instance: ExternalAuthenticationService;
    private externalAuthRepository: IExternalAuthenticationRepository;

    public static getInstance(): ExternalAuthenticationService {
        if (!ExternalAuthenticationService.instance) {
            ExternalAuthenticationService.instance = new ExternalAuthenticationService();
        }
        return ExternalAuthenticationService.instance;
    }

    private constructor() {
        this.externalAuthRepository = createExternalAuthenticationRepository();
    }

    async findAll(): Promise<IExternalAuthentication[]> {
        return await this.externalAuthRepository.findAll();
    }
    async findAllByAuthenticationId(authentication_id: string): Promise<IExternalAuthentication[]> {
        return await this.externalAuthRepository.findAllByAuthenticationId(authentication_id);
    }

    async findByExternalId(id: string): Promise<IExternalAuthentication | null> {
        return await this.externalAuthRepository.findByExternalId(id);
    }

    async findAllByProvider(provider: string): Promise<IExternalAuthentication[]> {
        return await this.externalAuthRepository.findAllByProvider(provider);
    }

    async findByExternalIdAndProvider(external_id: string, provider: string): Promise<IExternalAuthentication | null> {
        return await this.externalAuthRepository.findByExternalIdAndProvider(external_id, provider);
    }
    
    async createExternalAuthentication(externalAuthentication: Partial<IExternalAuthentication>): Promise<IExternalAuthentication> {
        const externalAuth = new ExternalAuthentication(externalAuthentication)
        const newExternalAuth = await this.externalAuthRepository.createExternalAuthentication(externalAuth);
        if (!newExternalAuth) {
            throw new Error('ExternalAuthentication not created');
        }
        return newExternalAuth
    }

    async updateExternalAuthentication(externalAuthentication: IExternalAuthentication): Promise<IExternalAuthentication> {
        const externalAuth = await this.externalAuthRepository.findByExternalIdAndProvider(externalAuthentication.external_id, externalAuthentication.provider);
        if (!externalAuth) {
            throw new Error('ExternalAuthentication not found');
        }

        const filteredData = Object.entries(externalAuthentication)
            .filter(([_, value]) => value !== null && value !== undefined && 
                !(typeof value === 'string' && value.trim() === ''))
            .reduce((acc, [key, value]) => {
                acc[key as keyof IExternalAuthentication] = value as any
                return acc
            }, {} as Partial<IExternalAuthentication>);

        if (Object.keys(filteredData).length === 0) {
            throw new Error('No data to update');
        }
        
        return await this.externalAuthRepository.updateExternalAuthentication(externalAuth, filteredData);
    }
    
    async deleteExternalAuthentication(id: string): Promise<void> {
        const externalAuth = await this.findByExternalId(id)

        if(!externalAuth){
            throw new HttpError(404, "Usuário não encontrado")
        }

        return await this.externalAuthRepository.deleteExternalAuthentication(externalAuth);
    }

    async addExternalToAuthentication({authentication_id, external_id, provider}: Partial<IExternalAuthentication>): Promise<IExternalAuthentication> {
        const externalAuth = await this.externalAuthRepository.findByExternalIdAndProvider(external_id!, provider!);
        if (externalAuth) {
            throw new HttpError(409, "Usuário externo já existe");
        }
        const newExternalAuth = await this.createExternalAuthentication({ external_id, authentication_id, provider });
        if (!newExternalAuth) {
            throw new Error('ExternalAuthentication not created');
        }
        return newExternalAuth
    }
    
}

export default ExternalAuthenticationService.getInstance();