import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser());
  // app.enableCors({
  //   origin: '*',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  //   credentials:true
  // });
  console.log(+process.env.REDIS_PORT)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
function cookieParser(): any {
  throw new Error('Function not implemented.');
}

