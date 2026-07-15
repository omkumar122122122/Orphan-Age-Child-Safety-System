import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', 'http://localhost:5173').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Refresh-Token'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new ClassSerializerInterceptor(reflector),
  );

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Orphan Age Child Safety System API')
    .setDescription(
      `
## Authentication Module API

Complete authentication system with:
- **JWT Access & Refresh Tokens** — Stateless, short-lived access tokens + long-lived refresh tokens
- **Role Based Access Control (RBAC)** — ADMIN, ORPHANAGE, PARENT, SOCIAL_WORKER, GUEST roles
- **Email Verification** — Token-based email confirmation on registration
- **OTP (One-Time Password)** — Time-based OTP for 2FA and sensitive operations
- **Password Management** — Secure bcrypt hashing, forgot/reset password flows
- **Rate Limiting** — Throttle guards to prevent brute-force attacks

### Default Roles
| Role | Description |
|------|-------------|
| ADMIN | Full system access |
| ORPHANAGE | Orphanage management access |
| PARENT | Parent/guardian access |
| SOCIAL_WORKER | Social worker access |
| GUEST | Read-only limited access |
      `,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'access-token',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-Refresh-Token',
        in: 'header',
        description: 'Refresh token for obtaining new access tokens',
      },
      'refresh-token',
    )
    .addTag('Auth', 'Authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addServer(`http://localhost:${port}`, 'Local Development')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Child Safety System API Docs',
  });

  await app.listen(port);
  logger.log(`Application running on: http://localhost:${port}`);
  logger.log(`API docs available at: http://localhost:${port}/docs`);
  logger.log(`API prefix: /${apiPrefix}`);
}

bootstrap();
