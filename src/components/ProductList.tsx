// Este componente es el encargado de mostrar la lista de productos.
import { useEffect, useState } from 'react';
import type { Product } from "../models/responses/Product";

// SOLUCIÓN AL ERROR TS2305: Importamos el objeto agrupado ProductService
import { ProductService } from "../services/ProductService";

export function ProductList() {
    // useState maneja el estado de los productos en un array.
    const [products, setProducts] = useState<Product[]>([]);

    // useEffect ejecuta la petición HTTP cuando el componente se monta por primera vez.
    useEffect(() => {
        // Llamamos al método getProducts desde el contenedor ProductService
        ProductService.getProducts()
            // SOLUCIÓN AL ERROR TS7006: Le indicamos explícitamente a 'Data' que es de tipo Product[]
            .then((Data: Product[]) => {
                setProducts(Data);
            })
            // SOLUCIÓN AL ERROR TS7006: Le indicamos explícitamente a 'error' el tipo 'any'
            .catch((error: any) => {
                console.error("Error al obtener los productos:", error);
            });
    }, []);

    return (
        <div>
            <h1>Lista de Productos</h1>
            
            {/* Iteramos sobre el array mediante .map() */}
            {products.map((product) => (
                /* SOLUCIÓN AL ERROR DE ID: Usamos 'resourceId' con la 'I' mayúscula (según el estándar CamelCase) */
                <div key={product.resourceid}>
                    <h2>{product.name}</h2>
                    <p>${product.price}</p>
                    <p>${product.description}</p>
                </div>
            ))}
        </div>
    );
}