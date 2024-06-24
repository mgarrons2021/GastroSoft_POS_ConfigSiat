import { api_eerpwebv } from "../api";
import axios from "axios";
export default class PlatoSucursalService {
    async getPlatosSucursal(sucursal_id) {
        return await axios.get(`${api_eerpwebv.url}get_platos_sucursales?sucursal_id=${sucursal_id}`);
    }
    async getPlatosCategoria(sucursal_id) {
        return await axios.get(`${api_eerpwebv.url}getCategories?sucursal_id=${sucursal_id}`);
    }
}

