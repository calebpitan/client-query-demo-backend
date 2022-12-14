import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { configFactory, TypeOrmConfigService } from './utils/config/index.js';
import { LoggerModule } from './utils/logger/index.js';
import { HelmetMiddleware, MorganMiddleware } from './utils/middleware/index.js';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configFactory], isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    LoggerModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware, HelmetMiddleware).forRoutes('*');
  }
}
