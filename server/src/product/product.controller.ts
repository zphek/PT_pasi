import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { filterOption } from './dto/filterOption.enum';

@Controller('product')
@UseGuards(SupabaseAuthGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: Prisma.ProductCreateInput) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query("page") page: string = "1") {
    if(parseInt(page) < 1){
      return {
        error: true,
        message: "The pageNumber can not be less than 1."
      }
    }

    return this.productService.findAll(parseInt(page));
  }

  @Get("/filter")
  findFiltered(@Query('filterType') filterType: filterOption, @Query('value') value: string){
    if (!filterType || !value) {
      return {
        error: true,
        message: `The field ${!filterType ? 'filterType' : 'value'} is missing, please insert the info.`
      };
    }

    // Validar que filterType sea válido
    if (!Object.values(filterOption).includes(filterType as filterOption)) {
      return {
        error: true,
        message: "The given filterType is not a valid one, the options we have are: " +
          "ipi (IS_PRODUCTNAME_INSERTED), " +
          "psw (PRODUCTS_STARTING_WITH), " +
          "pwc (PRODUCTS_WITH_CATEGORY). " +
          "Please try again."
      };
    }  

    return this.productService.productFilteredBy(filterType, value);
  }

  @Delete("/all")
  async removeAll(){
    console.log("XD")
    return this.productService.removeAll();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: Prisma.ProductUpdateInput) {
    return this.productService.update(id, updateProductDto);
  }
  
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

}
