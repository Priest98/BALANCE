import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
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
    const prisma = new PrismaClient();
    const newCards = [
      { name: 'Amazon', brand: 'amazon' },
      { name: 'American Express', brand: 'american_express' },
      { name: 'Amex', brand: 'amex' },
      { name: 'Apple', brand: 'apple' },
      { name: 'eBay', brand: 'ebay' },
      { name: 'Foot Locker', brand: 'foot_locker' },
      { name: 'Nike', brand: 'nike' },
      { name: 'Nord Storm', brand: 'nord_storm' },
      { name: 'Master Card', brand: 'mastercard' },
      { name: 'Play Station', brand: 'play_station' },
      { name: 'Razor Gold', brand: 'razor_gold' },
      { name: 'Sephora', brand: 'sephora' },
      { name: 'Steam', brand: 'steam' },
      { name: 'TT Visa', brand: 'tt_visa' },
      { name: 'Vanilla Visa', brand: 'vanilla_visa' },
      { name: 'Visa Silvery White', brand: 'visa_silvery_white' },
      { name: 'Walmart Visa', brand: 'walmart_visa' },
      { name: 'Xbox', brand: 'xbox' },
    ];
    await prisma.cardType.updateMany({ data: { active: false } });
    for (const ct of newCards) {
      const existing = await prisma.cardType.findFirst({
        where: { OR: [ { name: { contains: ct.name } }, { brand: ct.brand } ] }
      });
      if (existing) {
        await prisma.cardType.update({
          where: { id: existing.id },
          data: { name: ct.name, active: true, brand: ct.brand }
        });
      } else {
        await prisma.cardType.upsert({
          where: { brand: ct.brand },
          update: { name: ct.name, active: true },
          create: { name: ct.name, brand: ct.brand, active: true, logo: '' },
        });
      }
    }
    await prisma.$disconnect();

    await app.listen(port, '0.0.0.0');
    Logger.log(`🚀 Application running on: http://0.0.0.0:${port}/api`, 'Bootstrap');
    Logger.log(`📚 Swagger docs: http://0.0.0.0:${port}/api/docs`, 'Bootstrap');
  } catch (error) {
    Logger.error('Error starting application', error);
    process.exit(1);
  }
}

bootstrap();
