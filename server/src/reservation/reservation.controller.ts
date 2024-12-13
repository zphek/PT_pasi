import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Prisma } from '@prisma/client';
import { ReservationCreateInputDTO } from './dto/create-reservation';
import { ReservationUpdateInputDTO } from './dto/update-reservation';
import { SupabaseAuthGuard } from 'src/auth/guards/supabase-auth.guard';

@Controller('reservation')
@UseGuards(SupabaseAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  create(@Body() createReservationDto: ReservationCreateInputDTO) {
    return this.reservationService.create(createReservationDto);
  }

  @Get()
  findAll(@Query("page") page: string = "1") {
    if(parseInt(page) < 1){
      return {
        error: true,
        message: "The pageNumber can not be less than 1."
      }
    }

    return this.reservationService.findAll(parseInt(page));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservationDto: ReservationUpdateInputDTO) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(id);
  }
}
