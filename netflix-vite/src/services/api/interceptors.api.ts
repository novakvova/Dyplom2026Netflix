import axios from 'axios';
import {API_URL} from "../../config/api.config.ts";

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error?.response?.data || error.message);
        return Promise.reject(error);
    },
);

export default instance;