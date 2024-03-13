import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  app.enableCors()
  const logger = new Logger("Main")

  const port = config.get<number>("PORT") || 4003
  await app.listen(port, () => {
    logger.log("Server started on port ", port)
  });
}
bootstrap();
