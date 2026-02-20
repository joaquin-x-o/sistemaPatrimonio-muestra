import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dtos/productDtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/productDtos/updateProduct.dto';
import { RetireProductDto } from '../dtos/productDtos/retireProduct.dto';
import { ReviewProductDto } from '../dtos/productDtos/reviewProduct.dto';
import { UnusableProductDto } from '../dtos/productDtos/unusableProduct.dto';
import { TransferProductDto } from '../dtos/productDtos/transferProduct.dto';
import { BulkTransferProductDto } from '../dtos/productDtos/bulkTransferProducts.dto';
import { validateDto } from '../utils/dtoUtils/validateDto.util';
import { RepairProductDto } from '../dtos/productDtos/repairProduct.dto';
import { AppError } from '../utils/errorHandlerUtils/appError';
import { BulkProductCodeDto } from '../dtos/productDtos/bulkProductCodes.dto';
import { BulkRetireProductDto } from '../dtos/productDtos/bulkRetireProducts.dto';
import { BulkUnusableProductDto } from '../dtos/productDtos/bulkUnusableProducts.dto';
import { BulkRepairProductDto } from '../dtos/productDtos/bulkRepairProducts.dto';
import { validateBulkActionType } from '../utils/validationsUtils/validations.util';

export class ProductController {
    private productService: ProductService;

    // inicializacion del controller
    constructor(service: ProductService) {
        this.productService = service;
    }

    // POST: Crear nuevo producto
    async createProduct(req: Request, res: Response) {

        const body = req.body;

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        // creacion de la instancia del DTO 
        const dto = await validateDto(CreateProductDto, body)

        const newProduct = await this.productService.createProduct(userId, dto);
        return res.status(201).json({ message: 'Producto creado', data: newProduct });

    };

    // GET: Listar todos los productos
    async getProducts(req: Request, res: Response) {

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const products = await this.productService.findAllProducts(page, limit);
        return res.status(200).json({ products });

    };

    // GET: Mostrar un producto por su codigo
    async getProductByCode(req: Request, res: Response) {

        const { productCode } = req.params;

        const product = await this.productService.findOneProductByCode(Number(productCode));

        return res.status(200).json({ message: 'Producto encontrado', data: product });

    };

    // PATCH: Actualizar datos basicos de un producto
    async updateProduct(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        const dto = await validateDto(UpdateProductDto, body);

        const updatedProduct = await this.productService.updateProduct(Number(productCode), dto);
        return res.status(200).json({ message: 'Producto actualizado', data: updatedProduct });

    };

    // PATCH: Dar de baja un producto (soft delete)
    async retireProduct(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(RetireProductDto, body)
        const product = await this.productService.retireProduct(Number(productCode), userId, dto);

        return res.status(200).json({ message: 'Producto dado de baja correctamente', data: product });

    };

    // PATCH: reactivar producto (volver a dar de alta un producto dado de baja)
    async reactivateProduct(req: Request, res: Response) {

        const { productCode } = req.params;

        const product = await this.productService.reactivateProduct(Number(productCode));

        return res.status(200).json({ message: 'Producto disponible nuevamente', data: product });

    };

    // PATCH: marcar un producto para revisar
    async sendProductToReview(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        const dto = await validateDto(ReviewProductDto, body);

        const product = await this.productService.sendProductToReview(Number(productCode), dto);

        return res.status(200).json({ message: 'Producto asignado en estado de revisión.', data: product });

    };

    // PATCH: aprobar un producto que estuvo en estado de revisión
    async approveProduct(req: Request, res: Response) {

        const { productCode } = req.params;

        const product = await this.productService.approveProduct(Number(productCode));

        return res.status(200).json({ message: 'Producto revisado.', data: product });

    };

    // PATCH: marcar un producto como averiado o fuera de uso temporal
    async markProductAsUnusable(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        const dto = await validateDto(UnusableProductDto, body)

        const product = await this.productService.markProductAsUnusable(Number(productCode), dto);

        return res.status(200).json({ message: 'Producto marcado como fuera de uso', data: product });

    };

    // PATCH: reparar un producto averiado / habilitar un producto fuera de uso 
    async repairProduct(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        // NOTA: user provisorio
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(RepairProductDto, body);

        const repairedProduct = await this.productService.repairProduct(Number(productCode), userId, dto);

        return res.status(200).json({ message: 'Producto reparado.', data: repairedProduct });

    }

    // PATCH: transferir un producto a otro departamento
    async transferProduct(req: Request, res: Response) {

        const { productCode } = req.params;
        const body = req.body;

        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(TransferProductDto, body);

        const transferredProduct = await this.productService.transferProduct(Number(productCode), userId, dto)
        return res.status(200).json({ message: 'Producto transferido correctamente', data: transferredProduct });

    }

    // PATCH: transferir un producto a otro departamento
    async bulkTransferProducts(req: Request, res: Response) {

        console.log('Nombre de la clase DTO:', BulkTransferProductDto.name);

        const userId = req.user?.id;
        const body = req.body;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(BulkTransferProductDto, body);

        await this.productService.bulkTransferProduct(userId, dto)
        return res.status(200).json({ message: 'Productos transferidos correctamente.' });

    }

    // PATCH: verificiar la existencia fisica de un producto
    async checkProduct(req: Request, res: Response) {

        const { productCode } = req.params;

        const checkedProduct = await this.productService.checkProduct(Number(productCode))
        return res.status(200).json({ message: 'Producto verificado físicamente.', data: checkedProduct });

    }

    // DELETE: eliminar un producto
    async deleteProduct(req: Request, res: Response) {

        const { productCode } = req.params;

        await this.productService.deleteProduct(Number(productCode));
        return res.status(200).json({ message: 'Producto eliminado físicamente con éxito.' });

    }

    // GET: obtener productos de un departamento especifico
    async getProductsByDepartment(req: Request, res: Response) {

        const { departmentCode } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const products = await this.productService.findProductsByDepartment(page, limit, departmentCode);
        return res.status(200).json({ products });

    }

    // GET: obtener el historial de movimientos de un producto
    async getProductMovementHistory(req: Request, res: Response) {

        const { productCode } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const productHistory = await this.productService.findProductMovementHistory(page, limit, Number(productCode));
        return res.status(200).json({ data: productHistory });

    }

    // GET: obtener el historial de movimientos de un producto
    async getProductMaintenanceHistory(req: Request, res: Response) {

        const { productCode } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const productHistory = await this.productService.findProductMaintenanceHistory(page, limit, Number(productCode));
        return res.status(200).json({ data: productHistory });

    }


    // BULK ENDPOINTS

    // PATCH: obtener productos antes de su modificacion simultanea (bulk preview)
    async bulkPreviewProducts(req: Request, res: Response) {
        
        const {bulkaction} = req.params;
        const body = req.body;


        const bulkType = validateBulkActionType(bulkaction);

        const dto = await validateDto(BulkProductCodeDto, body);

        const previewProducts = await this.productService.getBulkProductsPreview(dto, bulkType);
        return res.status(200).json(previewProducts);
    }

    // PATCH: Dar de baja a mas de un producto a la vez
    async bulkRetireProducts(req: Request, res: Response) {

        const body = req.body;
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(BulkRetireProductDto, body)

        await this.productService.bulkRetireProduct(userId, dto);

        return res.status(200).json({ message: 'Productos dado de baja correctamente.' });

    };

    // PATCH: marcar mas de un producto como averiado o fuera de uso temporal
    async bulkMarkProductsAsUnusable(req: Request, res: Response) {

        const body = req.body;

        const dto = await validateDto(BulkUnusableProductDto, body)

        const product = await this.productService.bulkMarkProductAsUnusable(dto);

        return res.status(200).json({ message: 'Productos marcados como fuera de uso.', data: product });

    };

    // PATCH: reparar mas de un producto averiado / habilitar mas de un producto fuera de uso 
    async bulkRepairProducts(req: Request, res: Response) {

        const body = req.body;

        // NOTA: user provisorio
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError('Usuario no autenticado o token inválido', 401);
        };

        const dto = await validateDto(BulkRepairProductDto, body);

        await this.productService.bulkRepairProduct(dto, userId);

        return res.status(200).json({ message: 'Productos reparados.' });

    }


    // PATCH: verificiar la existencia fisica de un producto
    async bulkCheckProducts(req: Request, res: Response) {

        const body = req.body;

        const dto = await validateDto(BulkProductCodeDto, body);

        await this.productService.bulkCheckProduct(dto)
        return res.status(200).json({ message: 'Productos verificados físicamente con éxito.' });

    }
}



