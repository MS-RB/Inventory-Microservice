import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Connected to the database');
  }

  async create(createRentalDto: CreateRentalDto) {
    const { productIds, startDate, endDate, status } = createRentalDto;
  
    // Crear el alquiler con los productos asociados
    const rental = await this.rentals.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'active',  // El alquiler debe comenzar con estado "activo"
        products: {
          create: productIds.map((productId) => ({
            product: { connect: { id: productId } },
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  
    // Actualizar el estado y la cantidad de productos alquilados
    for (const productId of productIds) {
      const product = await this.products.findUnique({ where: { id: productId } });
  
      if (product.quantity > 0) {
        await this.products.update({
          where: { id: productId },
          data: {
            status: 'alquilado',
            quantity: {
              decrement: 1, // Reducir la cantidad disponible
            },
          },
        });
      } else {
        throw new Error(`No hay suficiente cantidad disponible para el producto con ID ${productId}`);
      }
    }
  
    return rental;
  }
  
  

  async findAll() {
    return this.rentals.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.rentals.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, updateRentalDto: UpdateRentalDto) {
    return this.rentals.update({
      where: { id },
      data: {
        startDate: new Date(updateRentalDto.startDate),
        endDate: new Date(updateRentalDto.endDate),
        status: updateRentalDto.status,
      },
    });
  }

  async remove(id: number) {
    const rental = await this.rentals.findUnique({
      where: { id },
      include: { products: true },
    });

    if (rental) {
      const productIds = rental.products.map((p) => p.productId);

      await this.products.updateMany({
        where: {
          id: { in: productIds },
        },
        data: { status: 'disponible' },
      });

      return this.rentals.delete({
        where: { id },
      });
    }
  }

  async completeRental(rentalId: number) {
    // Buscar el alquiler por su ID
    const rental = await this.rentals.findUnique({
      where: { id: rentalId },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
  
    if (!rental) {
      throw new Error(`Rental with ID ${rentalId} not found`);
    }
  
    // Marcar el alquiler como completado
    await this.rentals.update({
      where: { id: rentalId },
      data: {
        status: 'completed',
      },
    });
  
    // Actualizar los productos asociados, devolviendo su estado a disponible y sumando la cantidad
    for (const rentalProduct of rental.products) {
      await this.products.update({
        where: { id: rentalProduct.productId },
        data: {
          status: 'disponible', // Cambiar el estado a disponible
          quantity: {
            increment: 1, // Incrementar la cantidad disponible
          },
        },
      });
    }
  
    return { message: `Rental with ID ${rentalId} completed and products updated.` };
  }
  
}
