import type { Product } from "../models/responses/Product";
import { config } from "../config";

const API_URL = import.meta.env.DEV
  ? "/products"
  : `${config.api.url}/products`;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${text || response.statusText}`);
  }
  return response.json();
}

export const ProductService = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(API_URL);
    return handleResponse<Product[]>(response);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse<Product>(response);
  },

  async createProduct(product: Omit<Product, "resourceId">): Promise<Product> {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  async updateProduct(id: string, product: Omit<Product, "resourceId">): Promise<Product> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    return handleResponse<Product>(response);
  },

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`${text || response.statusText}`);
    }
  },
};
