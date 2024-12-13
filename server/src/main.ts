'use client'

import { NestFactory } from '@nestjs/core';
import * as CookieParser from "cookie-parser";
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  const config = new DocumentBuilder()
    .setTitle('PT_Pasi API')
    .setDescription('API para prueba tecnica.')
    .setVersion('1.0')
    .addTag('Prueba tecnica')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
