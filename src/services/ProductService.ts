import type { Product } from "../models/responses/Product";
import { config } from "../config";

const API_URL = `${config.api.url}/products`;

// Encapsulamos la función en un objeto para que coincida con tu componente
export const ProductService = {
    async getProducts(): Promise<Product[]> {
        try {
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
};