//Este archivo se encarga de cargar la configuración desde un archivo JSON y exportarla como un objeto de configuración tipado. 
// Esto permite que el resto del código pueda acceder a la configuración de manera segura y con autocompletado en los editores de código.
import rawConfig from "./config.json";
import type {Configuration} from "./configuration";
export const config = rawConfig as Configuration;
 