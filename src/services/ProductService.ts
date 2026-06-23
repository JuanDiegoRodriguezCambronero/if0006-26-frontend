import type { Product } from "../models/responses/Product";
import { config } from "../config";

const API_URL = `${config.api.url}/products`;

export async function getProducts(): Promise<Product[]> {
    try {
        //se pasa el endpoint completo a fetch, incluyendo el path /products
        //fetch se encarga de hacer la solicitud al backend y obtener la respuesta
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        return await response.json();   
    } catch (error) {
        console.error("Error en ProductService:", error);
        throw error;
    }
}