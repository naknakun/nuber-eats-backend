import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  console.log(`listening to ${port} port`);
}
bootstrap();
