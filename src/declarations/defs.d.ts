import {AxiosInstance} from "axios";

declare global {
    declare interface Window {
        VK: any;
        APIRequest: AxiosInstance;
    }

    declare namespace NodeJS {
        export interface ProcessEnv {
            REACT_APP_BASE_URL: string;
        }
    }
}
