import type { Product } from "../models/responses/Product";
import { config } from "../config";

const API_URL = import.meta.env.DEV
  ? "/products"
  : `${config.api.url}/products`;

export const ProductService = {
    async getProducts(): Promise<Product[]> {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                const text = await response.text().catch(() => "");
                throw new Error(`Error al obtener productos (${response.status}): ${text || response.statusText}`);
            }
            return await response.json();   
        } catch (error) {
            console.error("Error en ProductService:", error);
            throw error;
        }
    }
};
