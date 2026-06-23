// Este componente es el encargado de mostrar la lista de productos.
import {useEffect, useState} from 'react';
 
//import {ProductList} from "./components/ProductList"; trae el componente ProductList, que se encargará de mostrar la lista de productos.
import type {Product} from "../models/responses/Product";

// getProducts es una función que se encarga de obtener la lista de productos desde el servicio ProductService.
import {getProducts} from "../services/ProductService";


export function ProductList() {
    //Prodcut [] es un array de productos, y setProducts es la función que se encarga de actualizar el estado de los productos.
    //useState es un hook de React que se encarga de manejar el estado de los productos.
    //hook useEffect se encarga de ejecutar la función getProducts cuando el componente se monta, y actualizar el estado de los productos con la respuesta obtenida. 
    // Si ocurre un error al obtener los productos, se muestra un mensaje de error en la consola.
    //Qué es un hook? Un hook es una función que permite usar el estado y otras características de React sin escribir una clase. 
    // useState es un hook que permite agregar estado a un componente funcional, 
    // mientras que useEffect es un hook que permite realizar efectos secundarios en componentes funcionales, como la obtención de datos o la manipulación del DOM.
    const [products, setProducts] = useState<Product[]>([]);

    // useEffect es un hook de React que se encarga de ejecutar la función getProducts cuando el componente se monta, y actualizar el estado de los productos con la respuesta obtenida.
    useEffect(() => {
        // getProducts es una función que se encarga de obtener la lista de productos 
        // desde el servicio ProductService.
        getProducts()
            .then((Data) => {
                setProducts(Data);
            })
            .catch((error) => {
                console.error("Error al obtener los productos:", error);
            });
    }, []);

    return (
        <div>
            <h1>Lista de Productos</h1>
            // Aquí se mostrarán los productos obtenidos desde el servicio ProductService.
            //MAP es una función de JavaScript que se encarga de iterar sobre un array 
            y devolver un nuevo array con los resultados de la función que se le pasa como argumento.
            {products.map((product) => (
                <div key={product.resourceid}>
                    <h2>{product.name}</h2>
                    <p>{product.price}</p>
                </div>
            ))}
        </div>
    );
}

//export function ProductList() {
//    return (
//        <div>
//            <h1>Product List</h1>
//            {/* Aquí se mostrarán los productos */}
//        </div>
//    );
//}
//Este componente es el encargado de mostrar la lista de productos. 
// Actualmente, solo muestra un título, pero en el futuro se implementará la lógica para obtener y mostrar los productos
// utilizando el servicio ProductService.