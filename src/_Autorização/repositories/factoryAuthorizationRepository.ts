import { IGrantsRepository } from "../Interfaces/grantsInterfaces";
import { IProfileRepository } from "../Interfaces/profileInterfaces";
import GrantsRepositorySequelize from "./grantsRepository/grantsRepositorySequelize";
import ProfileRepositorySequelize from "./profileRepository/profileRepositorySequelize";

function createProfileRepository(): IProfileRepository {
    
    if (process.env.AUTHORIZATION_REPOSITORY === 'sequelize') {
        return new ProfileRepositorySequelize();
    }

    throw new Error("Repository not found");
}

function createGrantsRepository(): IGrantsRepository {
    
    if (process.env.AUTHORIZATION_REPOSITORY === 'sequelize') {       
        return new GrantsRepositorySequelize();
    }

    throw new Error("Repository not found");
}

export {
    createProfileRepository,
    createGrantsRepository
}