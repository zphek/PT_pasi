import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CustomerModule } from './customer/customer.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [AuthModule, ProductModule, PrismaModule, CustomerModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
