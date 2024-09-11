import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }


  async getProductRentalStatusById(productId: number) {
    const product = await this.products.findUnique({
      where: { id: productId },
      include: {
        category: {
          select: { name: true },
        },
      },
    });
  
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
  
    // Contar cuántos productos están alquilados
    const rentedCount = await this.rentals.count({
      where: {
        products: {
          some: {
            productId: productId,
            product: { status: 'alquilado' },
          },
        },
        status: 'active',
      },
    });
  
    // El availableCount es la cantidad de productos que están disponibles
    const availableCount = product.quantity;
  
    return {
      productName: product.name,
      category: product.category.name,
      totalQuantity: rentedCount + availableCount, // Cantidad total es la suma de ambos
      rentedCount,
      availableCount,
    };
  }
  
  
  

  // Método para obtener productos separados por estado (alquilado/disponible) y su cantidad
  async getProductsByStatusAndQuantity() {
    // Obtener todos los productos junto con su categoría
    const allProducts = await this.products.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Separar productos alquilados y disponibles
    const rentedProducts = allProducts.filter((product) => product.status === 'alquilado');
    const availableProducts = allProducts.filter((product) => product.status === 'disponible');

    return {
      totalProducts: allProducts.length,
      rentedProducts: rentedProducts.length,
      availableProducts: availableProducts.length,
      rentedProductsDetails: rentedProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category.name,
        inventoryCode: p.inventoryCode,
      })),
      availableProductsDetails: availableProducts.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category.name,
        inventoryCode: p.inventoryCode,
      })),
    };
  }

  // Otros métodos previos (crear, actualizar, eliminar) se mantienen igual
  async create(createProductDto: CreateProductDto) {
    const category = await this.categories.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new Error(`Category with ID ${createProductDto.categoryId} not found`);
    }

    const inventoryCode = this.generateInventoryCode(category.name);

    return this.products.create({
      data: {
        inventoryCode,
        name: createProductDto.name,
        categoryId: createProductDto.categoryId,
        type: createProductDto.type,
        gender: createProductDto.gender,
        description: createProductDto.description,
        quantity: createProductDto.quantity,
        size: createProductDto.size,
        condition: createProductDto.condition,
        area: createProductDto.area,
        box: createProductDto.box,
        status: createProductDto.status,
        acquisitionDate: createProductDto.acquisitionDate,
      },
    });
  }

  async findAll() {
    return this.products.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.products.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.products.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        categoryId: updateProductDto.categoryId,
        type: updateProductDto.type,
        gender: updateProductDto.gender,
        description: updateProductDto.description,
        quantity: updateProductDto.quantity,
        size: updateProductDto.size,
        condition: updateProductDto.condition,
        area: updateProductDto.area,
        box: updateProductDto.box,
        status: updateProductDto.status,
        acquisitionDate: updateProductDto.acquisitionDate,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.products.delete({
      where: { id },
    });
  }

  // Generar código de inventario basado en el nombre de la categoría
  private generateInventoryCode(categoryName: string): string {
    const prefix = categoryName.slice(0, 3).toUpperCase();
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomNumber}`;
  }
}
