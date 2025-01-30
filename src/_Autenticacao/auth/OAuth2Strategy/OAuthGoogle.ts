import axios from "../../../utils/axios/axios";
import { IOAuth2Strategy, IOAuthUserInfo } from "../../Interfaces/authInterfaces";
import jsonwebtoken from 'jsonwebtoken'
class OAuthGoogle implements IOAuth2Strategy {
    private static instance: IOAuth2Strategy

    private constructor(){}

    public static getInstance(): IOAuth2Strategy{
        if (!OAuthGoogle.instance) {
            OAuthGoogle.instance = new OAuthGoogle()
        }
        return OAuthGoogle.instance
    }

    async getToken(code: string): Promise<string> {
        try {
            const body: Record<string,string> = {
                client_id: process.env.OAUTH_GOOGLE_CLIENT_ID!,
                client_secret: process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
                grant_type: 'authorization_code',
                redirect_uri: process.env.OAUTH_GOOGLE_REDIRECT_URL!,
                code
            }

            const urlEncoded = Object.keys(body).map(key => 
                `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`
            ).join("&")

            const response = await axios.post('https://oauth2.googleapis.com/token', urlEncoded);

            return response.data.access_token;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getUserInfo(token: string): Promise<IOAuthUserInfo> {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", config)

        if (!userInfo){
            throw new Error("Error decoding token")
        }

        return userInfo;
    }
}

export default OAuthGoogle.getInstance()