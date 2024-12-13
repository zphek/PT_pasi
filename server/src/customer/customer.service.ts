import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          email: data.email
        }
      });
  
      if (customer) {
        throw new BadRequestException("Email already exists in the database");
      }
  
      const modifiedData: Prisma.CustomerCreateInput = {
        ...data,
        createdAt: new Date().toUTCString()
      }

      const newCustomer = await this.prisma.customer.create({
        data: modifiedData
      });

      return {
        statusCode: 201,
        message: "Customer created successfully",
        data: newCustomer
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while creating customer");
    }
  }

  async findAll(pageNumber: number) {
    try {
      const itemsPerPage = 10;
      const customerCount = await this.prisma.customer.count();
      const pageCount = Math.ceil(customerCount / itemsPerPage);
  
      if (pageNumber < 1 || pageNumber > pageCount) {
        throw new BadRequestException(`Page number must be between 1 and ${pageCount}`);
      }
  
      const offset = (pageNumber - 1) * itemsPerPage;
      
      const customers = await this.prisma.customer.findMany({
        skip: offset,
        take: itemsPerPage,
        orderBy: { createdAt: 'desc' }
      }); 
  
      return {
        statusCode: 200,
        message: "Customers retrieved successfully",
        data: {
          customers,
          pagination: {
            currentPage: pageNumber,
            totalPages: pageCount,
            itemsPerPage,
            totalItems: customerCount,
            hasNextPage: pageNumber < pageCount,
            hasPreviousPage: pageNumber > 1
          }
        }
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while fetching customers");
    }
  }

  async findOne(id: string) {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid customer ID format');
      }
  
      const customer = await this.prisma.customer.findUnique({
        where: { customerId: id }
      });
  
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }
  
      return {
        statusCode: 200,
        message: "Customer retrieved successfully",
        data: customer
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while fetching customer");
    }
  }

  async searchCustomers(searchTerm: string) {    
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      });

      if (customers.length === 0) {
        throw new NotFoundException("No customers found matching your criteria");
      }

      return {
        statusCode: 200,
        message: "Customers retrieved successfully",
        data: customers
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while searching customers");
    }
  }

  async update(id: string, data: Prisma.CustomerUpdateInput) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { customerId: id }
      });
  
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }
  
      const updatedCustomer = await this.prisma.customer.update({
        where: { customerId: id },
        data: {
          ...data
        }
      });

      return {
        statusCode: 200,
        message: "Customer updated successfully",
        data: updatedCustomer
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while updating customer");
    }
  }

  async remove(id: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { customerId: id }
      });

      console.log(customer, id);
  
      if (!customer) {
        throw new NotFoundException("Customer not found");
      }
  
      const response = await this.prisma.customer.delete({
        where: { customerId: id }
      });

      return {
        statusCode: 200,
        message: "Customer deleted successfully"
      };

    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while deleting customer");
    }
  }
}