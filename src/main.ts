import { Configuration } from '@/utils/config/index.js';

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { Choose } from './utils/types/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appConfig = app
    .get<ConfigService<Configuration>>(ConfigService)
    .get<Choose<Configuration, 'app'>>('app')!;

  const config = new DocumentBuilder()
    .setTitle('Client Query Demo Backend')
    .setDescription(
      'A simple collection of backend services spun up to quickly demo client querying',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.port);
}
bootstrap();
