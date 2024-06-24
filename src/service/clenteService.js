import { api_eerpwebv } from "../api";
import axios from "axios";
export default class ClienteService {
    async getClienteByCiNit(ci_nit) {
        // return await fetch(`${url}/filter_client?codigo=${codigo}`).then(res => res.json()).then(d => d.data);
        // return await axios.get(`${api_eerpwebv.url}filter_client?codigo=${ci_nit}`).then(d => d.data);
        return await axios.get(`${api_eerpwebv.url}filter_client?codigo=${ci_nit}`);
    }
}

