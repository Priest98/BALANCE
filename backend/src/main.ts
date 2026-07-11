import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

  // ─── Security ───────────────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // swagger UI needs inline
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );

  app.enableCors({
    origin: nodeEnv === 'production' ? corsOrigins : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
    credentials: false,
  });

  // ─── Global Pipes ───────────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ─── API Prefix ─────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ─── Swagger ─────────────────────────────────────────────────────────────────
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('GiftCard Verify API')
      .setDescription('Gift Card Verification Platform API')
      .setVersion('1.0')
      .addTag('verification', 'Card verification endpoints')
      .addTag('card-types', 'Supported card types')
      .addTag('health', 'Health checks')
      .addTag('admin', 'Admin endpoints (requires X-Admin-Key header)')
      .addApiKey({ type: 'apiKey', name: 'X-Admin-Key', in: 'header' }, 'admin-key')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  try {
    await app.listen(port, '0.0.0.0');
    Logger.log(`🚀 Application running on: http://0.0.0.0:${port}/api`, 'Bootstrap');
    Logger.log(`📚 Swagger docs: http://0.0.0.0:${port}/api/docs`, 'Bootstrap');
  } catch (error) {
    Logger.error('Error starting application', error);
    process.exit(1);
  }
}

bootstrap();
