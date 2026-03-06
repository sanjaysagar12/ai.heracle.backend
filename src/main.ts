import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { type Express } from 'express';

// Cache the Express app between Vercel invocations (warm starts)
let cachedApp: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cachedApp) return cachedApp;

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  // Swagger / OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle('nestjs-starter API')
    .setDescription('nestjs-starter API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT',
    )
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${process.env.API_URL || 'http://localhost:3000'}/auth/google`,
            scopes: {
              'email profile': 'Get email and profile info',
            },
          },
        },
      },
      'google-oauth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        usePkceWithAuthorizationCodeGrant: true,
      },
    },
  });

  app.enableCors();
  await app.init();
  cachedApp = expressApp;
  return cachedApp;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((expressApp) => {
    const port = process.env.PORT ?? 3000;
    expressApp.listen(port, () => {
      console.log(`Application is running on: http://localhost:${port}`);
    });
  });
}

// Serverless handler for Vercel — expressApp is a plain (req, res) => void function
export default async (req: any, res: any) => {
  const expressApp = await bootstrap();
  return expressApp(req, res);
};
