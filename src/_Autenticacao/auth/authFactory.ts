import { IAuthStrategy } from "../Interfaces/authInterfaces";
import jwtFactory from "./auths/jwtFactory";
import sessionFactory from "./auths/sessionFactory";

import dotenv from 'dotenv';
dotenv.config();

function createAuthStrategy(): IAuthStrategy {
    if (process.env.AUTH_STRATEGY === "jwt")  {
        return new jwtFactory();
    }

    if (process.env.AUTH_STRATEGY === "session") {
        return new sessionFactory();
    }

    
   throw new Error("Repository not found");
}


export default createAuthStrategy;
