import axios from "axios";


export const baseURL = "http://192.168.1.200:5000";

const api = axios.create({
    baseURL: baseURL,
});


export default api;