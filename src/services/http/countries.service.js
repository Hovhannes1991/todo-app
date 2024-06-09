import axios from "axios";


export const getAllCountries = async () => {
    return axios.get("/countries/all");
}