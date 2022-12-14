import { Choose } from '@/utils/types/index.js';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { Configuration } from './config.js';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(
    _connectionName?: string | undefined,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const appConfig = this.configService.getOrThrow<Choose<Configuration, 'app'>>('app');
    const databaseConfig =
      this.configService.getOrThrow<Choose<Configuration, 'database'>>('database');
    const authConfig =
      this.configService.getOrThrow<Choose<Configuration, 'auth.postgres'>>('auth.postgres');

    return {
      type: 'postgres',
      database: databaseConfig.database_name,
      host: databaseConfig.host,
      port: Number(databaseConfig.port),
      username: authConfig.user,
      password: authConfig.password,
      synchronize: !appConfig.production,
      autoLoadEntities: true,
    };
  }
}
