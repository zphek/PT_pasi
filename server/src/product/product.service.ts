import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { filterOption } from "./dto/filterOption.enum";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    try {
      const product = await this.prisma.product.findUnique({
        where: {
          productName: data.productName
        }
      });

      console.log(product, "XD")
  
      if (product) {
        throw new BadRequestException("Product name already exists in the database");
      }
  
      const modifiedData: Prisma.ProductCreateInput = {
        ...data, 
        isActive: true, 
        imageUrl: "", 
        updatedAt: new Date().toUTCString(), 
        createdAt: new Date().toUTCString()
      } 

      const newProduct = await this.prisma.product.create({
        data: modifiedData
      });

      return {
        statusCode: 201,
        message: "Product created successfully",
        data: newProduct
      };

    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while creating product");
    }
  }

  async findAll(pageNumber: number) {
    try {
      const itemsPerPage = 10;
      const productCount = await this.prisma.product.count();
      const pageCount = Math.ceil(productCount / itemsPerPage);

      console.log("p1")
  
      if (pageNumber < 1 || pageNumber > pageCount) {
        throw new BadRequestException(`Page number must be between 1 and ${pageCount}`);
      }
      
      const offset = (pageNumber - 1) * itemsPerPage;

      const products = await this.prisma.product.findMany({
        skip: offset,
        take: itemsPerPage,
        orderBy: { createdAt: 'desc' }
      }); 

      console.log(products);
  
      return {
        statusCode: 200,
        message: "Products retrieved successfully",
        data: {
          products,
          pagination: {
            currentPage: pageNumber,
            totalPages: pageCount,
            itemsPerPage,
            totalItems: productCount,
            hasNextPage: pageNumber < pageCount,
            hasPreviousPage: pageNumber > 1
          }
        }
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while fetching products");
    }
  }

  async findOne(id: string) {
    try {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new BadRequestException('Invalid product ID format');
      }
  
      const product = await this.prisma.product.findUnique({
        where: { productId: id }
      });
  
      if (!product) {
        throw new NotFoundException("Product not found");
      }
  
      return {
        statusCode: 200,
        message: "Product retrieved successfully",
        data: product
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while fetching product");
    }
  }

  async productFilteredBy(FilterOption: filterOption, value: string) {    
    try {
      const products = await this.prisma.product.findMany({
        take: 5,
        where: this.prismaFilterSchema(FilterOption, value)
      });

      if (FilterOption === filterOption.IS_PNAME_INSERTED) {
        return {
          statusCode: 200,
          message: "Product name verification completed",
          data: {
            exists: products.length > 0
          }
        };
      }

      if (products.length === 0) {
        throw new NotFoundException("No products found matching your criteria");
      }

      return {
        statusCode: 200,
        message: "Products retrieved successfully",
        data: products
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while filtering products");
    }
  }

  async update(id: string, data: Prisma.ProductUpdateInput) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { productId: id }
      });
  
      if (!product) {
        throw new NotFoundException("Product not found");
      }
  
      const updatedProduct = await this.prisma.product.update({
        where: { productId: id },
        data: {
          ...data,
          updatedAt: new Date().toUTCString()
        }
      });

      return {
        statusCode: 200,
        message: "Product updated successfully",
        data: updatedProduct
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while updating product");
    }
  }

  async remove(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { productId: id }
      });
  
      if (!product) {
        throw new NotFoundException("Product not found");
      }
  
      await this.prisma.product.delete({
        where: { productId: id }
      });

      return {
        statusCode: 200,
        message: "Product deleted successfully"
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException("Error while deleting product");
    }
  }

  async removeAll() {
    try {
      const data = await this.prisma.product.deleteMany();
      console.log("All products deleted successfully.", data);
      return data;
    } catch (error) {
      console.error("Error deleting products:", error);
      throw new Error("Failed to delete products.");
    }
  }

  private prismaFilterSchema(FilterOption: filterOption, value: string): Prisma.ProductWhereInput {
    switch (FilterOption) {
      case filterOption.IS_PNAME_INSERTED:
        return {
          productName: {
            equals: value,
            mode: 'insensitive'
          }
        };
      
      case filterOption.PRODUCTS_WITH_CATEGORY:
        return {
          category: value
        };
      
      case filterOption.PRODUCTS_STARTING_WITH:
        return {
          productName: {
            startsWith: value,
            mode: 'insensitive'
          }
        };
      
      default:
        throw new BadRequestException('Invalid filter option');
    }
  }
}