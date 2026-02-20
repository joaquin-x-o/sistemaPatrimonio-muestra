import "dotenv/config";
import { DataSource } from 'typeorm';

import { User } from "../entities/User";
import { Department } from "../entities/Department";
import { Product } from "../entities/Product";

import { RetirementHistory } from "../entities/RetirementHistory";
import { MaintenanceHistory } from "../entities/MaintenanceHistory";
import { MovementHistory } from "../entities/MovementHistory";



export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    logging: true,
    entities: [User, Department, Product, RetirementHistory, MovementHistory, MaintenanceHistory],
    subscribers: [],
    migrations: [],
    extra: {
        timezone: 'America/Argentina/Buenos_Aires' 
    }
})