'use client'

import { NestFactory } from '@nestjs/core';
import * as CookieParser from "cookie-parser";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(CookieParser());

  app.enableCors({
    origin: true, // O específica tu origen: 'http://localhost:3000'
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
      'Set-Cookie',
      'Authorization'
    ]
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
