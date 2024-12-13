import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateCustomerDTO } from './dto/create-customer.dto';

@ApiTags('Customer')
@Controller('customer')
@UseGuards(SupabaseAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un cliente',
    description: 'Crea un nuevo cliente en el sistema.',
  })
  @ApiBody({ type: CreateCustomerDTO })
  async create(@Body() createCustomerDto: Prisma.CustomerCreateInput) {
    return await this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar clientes',
    description: 'Obtiene una lista paginada de clientes.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de la página (por defecto, la página 1).',
    example: 1,
  })
  findAll(@Query('page') page: string = '1') {
    if (parseInt(page) < 1) {
      return {
        error: true,
        message: 'El número de página no puede ser menor que 1.',
      };
    }

    return this.customerService.findAll(parseInt(page));
  }

  @Get('/findby')
  @ApiOperation({
    summary: 'Buscar clientes',
    description: 'Busca clientes por un valor específico.',
  })
  @ApiQuery({
    name: 'value',
    description: 'Valor a buscar (nombre, email, etc.).',
    example: 'John',
  })
  findCustomer(@Query('value') value: string) {
    return this.customerService.searchCustomers(value);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un cliente',
    description: 'Obtiene la información de un cliente por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a buscar.',
    example: '12345',
  })
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un cliente',
    description: 'Actualiza la información de un cliente existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a actualizar.',
    example: '12345',
  })
  @ApiBody({
    description: 'Datos necesarios para actualizar un cliente.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe Updated' },
        email: { type: 'string', example: 'updatedemail@example.com' },
        phone: { type: 'string', example: '+9876543210' },
      },
    },
  })
  update(@Param('id') id: string, @Body() updateCustomerDto: Prisma.CustomerUpdateInput) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un cliente',
    description: 'Elimina un cliente por su ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del cliente a eliminar.',
    example: '12345',
  })
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }
}
