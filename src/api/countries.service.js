import {httpService} from "@/services/http/http-service.js";


export const getAllCountries = async () => {
    return httpService.get("/countries/all");
}