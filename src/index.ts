import "reflect-metadata";
import "dotenv/config";
import "./types/express";

import app from "./app"

import { AppDataSource } from "./db/dataSource";

async function main() {
  try {
    // Conexión a base de datos
    await AppDataSource.initialize();
    console.log("Base de datos conectada");

    // Inicialización del servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor listo en http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error(error);
  }
}

main();