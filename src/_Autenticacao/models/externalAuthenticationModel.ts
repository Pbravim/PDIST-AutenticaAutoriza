import { IExternalAuthentication } from "../Interfaces/authInterfaces";

class ExternalAuthentication implements IExternalAuthentication {
    external_id: string;
    authentication_id: string;
    email: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;

    constructor({ provider, external_id, authentication_id, email }: Partial<IExternalAuthentication>) {
        if (!provider) {
            throw new Error("Provider is required.");
        }
        if (!external_id) {
            throw new Error("External ID is required.");
        }
        if (!authentication_id) {
            throw new Error("Authentication ID is required.");
        }
        if (!email) {
            throw new Error("Email is required.");
        }

        this.provider = provider;
        this.external_id = external_id;
        this.authentication_id = authentication_id;
        this.email = email;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}

export default ExternalAuthentication;
