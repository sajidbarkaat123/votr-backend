import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './global-filter/global-filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { NextFunction, Request, Response } from 'express';


function cleanObject(obj: any): any {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(cleanObject);
    }
    const newObj = {};
    // Use Object.keys to iterate over own properties.
    Object.keys(obj).forEach(key => {
      // Trim the key to remove any accidental spaces or tabs.
      const trimmedKey = key.trim();
      newObj[trimmedKey] = cleanObject(obj[key]);
    });
    return newObj;
  }
  return obj;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()

  // app.use((req:Request, res:Response, next:NextFunction) => {
  //   if (req.body && typeof req.body === 'object') {
  //     req.body = cleanObject(req.body);
  //   }
  //   next();
  // });
  // Configure static file serving for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  const config = new DocumentBuilder()
  .setTitle('Sample Project')
  .setDescription('The Sample Project API description')
  .setVersion('1.0')
  .addBearerAuth() 
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document); 


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
