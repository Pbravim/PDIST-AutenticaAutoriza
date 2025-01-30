import axios, { AxiosRequestConfig } from "axios";

class Axios {
    public async get(url: string, options?: AxiosRequestConfig): Promise<any> {
        try {
            return await axios.get(url, options);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async post(url: string, data: any, options?: AxiosRequestConfig): Promise<any> {
        try {
            return await axios.post(url, data, options);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async put(url: string, data: any, options?: AxiosRequestConfig): Promise<any> {
        try {
            return await axios.put(url, data, options);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async delete(url: string, options?: AxiosRequestConfig): Promise<any> {
        try {
            return await axios.delete(url, options);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


export default new Axios();