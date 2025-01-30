import { v4 as uuidv4 } from 'uuid';
import { IProfile, IProfileParams } from '../Interfaces/profileInterfaces';



class Profile implements IProfile { 
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;

    /**
     * Constructor for Profile class.
     * 
     * @param {IProfileParams} profileParams - Object with the properties to create a Profile.
     * @param {string} profileParams.name - The name of the profile.
     * @param {string} [profileParams.description=null] - The description of the profile.
     */
    constructor({name, description = null} : IProfileParams){
        this.validateName(name);
        this.name = name;

        this.id = uuidv4()
        this.description = description
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }


    /**
     * Validate the name of the profile.
     * 
     * @param {string} name - The name of the profile.
     * 
     * @throws {Error} - If the name is null.
     */
    validateName(name: string): void {
        if (!name) {
            throw new Error('name é nulo');
        }
    }

}

export default Profile;