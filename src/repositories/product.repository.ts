import { In, Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";
import { EntityManager } from "typeorm";

import { Product } from "../entities/Product";
import { Department } from "../entities/Department";



export class ProductRepository {

    private repository: Repository<Product>;

    constructor() {
        this.repository = AppDataSource.getRepository(Product);
    }

    //verificar producto existente (por codigo de producto)
    async verifyProduct(productCode: number, entityManager?: EntityManager): Promise<Product | null> {

        const repository = entityManager ? entityManager.getRepository(Product) : this.repository;

        const product = repository.findOne({
            where: { productCode: productCode },
            relations: ['department']
        });

        return product;
    }

    // crear producto
    async createProduct(product: Product, entityManager?: EntityManager): Promise<Product> {

        return await this.saveProduct(product, entityManager);
    }

    // guardar producto a la base de datos
    async saveProduct(newProduct: Product, entityManager?: EntityManager): Promise<Product> {
        
        const repository = entityManager ? entityManager.getRepository(Product) : this.repository;

        return await repository.save(newProduct);
    }

    // buscar productos paginados
    async searchProducts(page: number, limit: number): Promise<[Product[], number]> {

        const skip = (page - 1) * limit;

        const [products, total] = await this.repository.findAndCount({
            relations: ['department', 'user'],
            take: limit, // elementos que se obtienen
            skip: skip,  // elementos salteados
            order: { createdAt: 'DESC' }
        });

        return [products, total];
    }

    // buscar un producto por su codigo
    async searchProductByCode(productCode: number): Promise<Product | null> {
        const product = await this.repository.findOne({
            where: { productCode: productCode },
            relations: ['department', 'user']
        })

        return product;
    }

    // actualizar producto
    async updateProduct(productEntity: Product, entityManager?: EntityManager): Promise<Product | null> {

        const repository = entityManager ? entityManager.getRepository(Product) : this.repository;

        // PRELOAD 
        const updatedProduct = await repository.preload(productEntity);

        // Si el ID no existe en la BD, preload devuelve undefined
        if (!updatedProduct) {
            return null;
        }

        // guardado del producto actualizado
        return await this.saveProduct(updatedProduct, entityManager);
    }

    // eliminar un producto de la base de datos
    async deleteProduct(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        } catch (error: any) {
            if (error.code === '23503') {
                throw error;
            }
            throw error;
        }
    }


    // contar productos existentes en un departamendo indicado
    async countProductsByDepartment(department: Department): Promise<number> {
        const productsCounted = await this.repository.count({
            where: {
                department: department,
                isActive: true
            }
        })
        return productsCounted;
    }

    // contar productos en total que hay en un departamento
    async countAllProductsByDepartment(department: Department): Promise<number> {
        const productsCounted = await this.repository.count({
            where: {
                department: department
            }
        })
        return productsCounted;
    }

    // buscar productos en un departamento (paginado)
    async searchProductsByDepartment(page: number, limit: number, department: Department): Promise<[Product[], number]> {

        const skip = (page - 1) * limit;

        const [products, total] = await this.repository.findAndCount({
            where: {
                department: { id: department.id }
            },
            relations: ['department', 'user'],
            take: limit,
            skip: skip,
            order: { createdAt: 'DESC' },
        });

        return [products, total];
    }

    // listar productos segun sus codigos
    async listProductsByCode(productCodes: number[], entityManager?: EntityManager): Promise<Product[]>{
        
        const repository = entityManager ? entityManager.getRepository(Product) : this.repository;

        const products = await repository.find({
            where: { productCode: In(productCodes)},
            relations: ['department']
        });


        return products;
    }
}