import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
    credentials: true, // Allow cookies to be sent with requests
  });
  app.use(cookieParser());
  await app.listen(8000);
}
bootstrap();
