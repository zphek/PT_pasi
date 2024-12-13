import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReservationCreateInputDTO } from './dto/create-reservation';
import { ReservationUpdateInputDTO } from './dto/update-reservation';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async create(createReservationDto: ReservationCreateInputDTO) {
    try {
      if (createReservationDto.products.length === 0) {
        throw new BadRequestException('Reservation must have at least one product');
      }

      const customer = await this.prisma.customer.findUnique({
        where: { customerId: createReservationDto.customerId }
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${createReservationDto.customerId} not found`);
      }

      // Get all products and verify stock
      const productIds = createReservationDto.products.map(product => product.productId);
      const existingProducts = await this.prisma.product.findMany({
        where: { productId: { in: productIds } }
      });

      if (existingProducts.length !== productIds.length) {
        const foundIds = existingProducts.map(p => p.productId);
        const missingIds = productIds.filter(id => !foundIds.includes(id));
        throw new NotFoundException(`Products not found: ${missingIds.join(', ')}`);
      }

      // Verify stock for each product
      for (const requestedProduct of createReservationDto.products) {
        const product = existingProducts.find(p => p.productId === requestedProduct.productId);
        if (product.quantityInStock < requestedProduct.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.productName}. Available: ${product.quantityInStock}, Requested: ${requestedProduct.quantity}`
          );
        }
      }

      // Create reservation and update stock in a transaction
      const newReservation = await this.prisma.$transaction(async (prisma) => {
        // Create the reservation
        const reservation = await prisma.reservation.create({
          data: {
            customerId: createReservationDto.customerId,
            date: createReservationDto.date,
            status: createReservationDto.status,
            total: createReservationDto.total,
            createdAt: new Date().toUTCString(),
            products: {
              createMany: {
                data: createReservationDto.products.map(product => ({
                  productId: product.productId,
                  productName: product.productName,
                  quantity: product.quantity,
                  unitPrice: product.unitPrice,
                  totalPrice: product.totalPrice
                }))
              }
            }
          },
          include: {
            products: true
          }
        });

        // Update stock for each product
        for (const product of createReservationDto.products) {
          await prisma.product.update({
            where: { productId: product.productId },
            data: {
              quantityInStock: {
                decrement: product.quantity
              }
            }
          });
        }

        return reservation;
      });

      return {
        statusCode: 201,
        message: 'Reservation created successfully',
        data: newReservation
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while creating reservation');
    }
  }

  async findAll(pageNumber: number) {
    try {
      const itemsPerPage = 10;
      const reservationCount = await this.prisma.reservation.count();
      const pageCount = Math.ceil(reservationCount / itemsPerPage);

      if (pageNumber < 1 || pageNumber > pageCount) {
        throw new BadRequestException(`Page number must be between 1 and ${pageCount}`);
      }

      const offset = (pageNumber - 1) * itemsPerPage;

      const reservations = await this.prisma.reservation.findMany({
        skip: offset,
        take: itemsPerPage,
        include: {
          products: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return {
        statusCode: 200,
        message: 'Reservations retrieved successfully',
        data: {
          reservations,
          pagination: {
            currentPage: pageNumber,
            totalPages: pageCount,
            itemsPerPage,
            totalItems: reservationCount,
            hasNextPage: pageNumber < pageCount,
            hasPreviousPage: pageNumber > 1
          }
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while fetching reservations');
    }
  }

  async findOne(id: string) {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid reservation ID format');
      }

      const reservation = await this.prisma.reservation.findUnique({
        where: { reservationId: id },
        include: {
          products: true,
          customer: true
        }
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return {
        statusCode: 200,
        message: 'Reservation retrieved successfully',
        data: reservation
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while fetching reservation');
    }
  }

  async update(id: string, updateReservationDto: ReservationUpdateInputDTO) {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid reservation ID format');
      }

      const existingReservation = await this.prisma.reservation.findUnique({
        where: { reservationId: id },
        include: { products: true }
      });

      if (!existingReservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (updateReservationDto.products?.length > 0) {
        // Get all products and verify stock
        const productIds = updateReservationDto.products.map(product => product.productId);
        const existingProducts = await this.prisma.product.findMany({
          where: { productId: { in: productIds } }
        });

        if (existingProducts.length !== productIds.length) {
          const foundIds = existingProducts.map(p => p.productId);
          const missingIds = productIds.filter(id => !foundIds.includes(id));
          throw new NotFoundException(`Products not found: ${missingIds.join(', ')}`);
        }

        // Calculate stock changes
        for (const newProduct of updateReservationDto.products) {
          const oldProduct = existingReservation.products.find(p => p.productId === newProduct.productId);
          const product = existingProducts.find(p => p.productId === newProduct.productId);
          
          const stockChange = oldProduct ? newProduct.quantity - oldProduct.quantity : newProduct.quantity;
          
          if (product.quantityInStock < stockChange) {
            throw new BadRequestException(
              `Insufficient stock for product ${product.productName}. Available: ${product.quantityInStock}, Additional needed: ${stockChange}`
            );
          }
        }

        // Update in a transaction
        return await this.prisma.$transaction(async (prisma) => {
          // First restore stock from old products
          for (const oldProduct of existingReservation.products) {
            await prisma.product.update({
              where: { productId: oldProduct.productId },
              data: {
                quantityInStock: {
                  increment: oldProduct.quantity
                }
              }
            });
          }

          // Delete old reservation products
          await prisma.reservationProduct.deleteMany({
            where: { reservationId: id }
          });

          // Update reservation with new products
          const updatedReservation = await prisma.reservation.update({
            where: { reservationId: id },
            data: {
              ...(updateReservationDto.customerId && {
                customer: {
                  connect: { customerId: updateReservationDto.customerId }
                }
              }),
              ...(updateReservationDto.date && { date: updateReservationDto.date }),
              ...(updateReservationDto.status && { status: updateReservationDto.status }),
              ...(updateReservationDto.total && { total: updateReservationDto.total }),
              products: {
                createMany: {
                  data: updateReservationDto.products.map(product => ({
                    productId: product.productId,
                    productName: product.productName,
                    quantity: product.quantity,
                    unitPrice: product.unitPrice,
                    totalPrice: product.totalPrice
                  }))
                }
              }
            },
            include: {
              products: true
            }
          });

          // Update stock for new products
          for (const product of updateReservationDto.products) {
            await prisma.product.update({
              where: { productId: product.productId },
              data: {
                quantityInStock: {
                  decrement: product.quantity
                }
              }
            });
          }

          return {
            statusCode: 200,
            message: 'Reservation updated successfully',
            data: updatedReservation
          };
        });
      }

    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while updating reservation');
    }
  }

  async remove(id: string) {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid reservation ID format');
      }

      const reservation = await this.prisma.reservation.findUnique({
        where: { reservationId: id },
        include: { products: true }
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      // Delete reservation and restore stock in a transaction
      await this.prisma.$transaction(async (prisma) => {
        // Restore stock for each product
        for (const product of reservation.products) {
          await prisma.product.update({
            where: { productId: product.productId },
            data: {
              quantityInStock: {
                increment: product.quantity
              }
            }
          });
        }

        // Delete reservation products
        await prisma.reservationProduct.deleteMany({
          where: { reservationId: id }
        });

        // Delete reservation
        await prisma.reservation.delete({
          where: { reservationId: id }
        });
      });

      return {
        statusCode: 200,
        message: 'Reservation deleted successfully'
      };

    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error while deleting reservation');
    }
  }
}