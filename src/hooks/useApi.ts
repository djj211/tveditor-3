import axios, { AxiosRequestConfig } from "axios";

export const useApi = (baseUrl: string) => {

    const getUrl = (inputPath: string) => {
        if (inputPath.charAt(0) === "/") {
            return `${baseUrl}${inputPath}`;
        }

        return `${baseUrl}/${inputPath}`; 
    }

    const get = async <T>(path: string, config: AxiosRequestConfig): Promise<T> => {
        const resp = await axios.get<T>(getUrl(path), config);
        return resp.data;
    }

    const post = async <T, TData>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<T> => {
        const resp = await axios.post<T>(getUrl(path), data, config);
        return resp.data;
    }

    const put = async <T, TData>(path: string, data?: TData, config?: AxiosRequestConfig): Promise<T> => {
        const resp = await axios.put<T>(getUrl(path), data, config);
        return resp.data;
    }

    const del = async <T>(path: string, config: AxiosRequestConfig): Promise<T> => {
        const resp = await axios.delete<T>(getUrl(path), config);
        return resp.data;
    }

    return {
        get,
        post,
        put,
        del
    }
}