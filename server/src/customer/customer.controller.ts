import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { get } from 'http';

@Controller('customer')
@UseGuards(SupabaseAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(@Body() createCustomerDto: Prisma.CustomerCreateInput) {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query("page") page: string = "1") {
    if(parseInt(page) < 1){
      return {
        error: true,
        message: "The pageNumber can not be less than 1."
      }
    }

    return this.customerService.findAll(parseInt(page));
  }

  @Get("/findby")
  findCustomer(@Query('value') value: string){
    return this.customerService.searchCustomers(value);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: Prisma.CustomerUpdateInput) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
