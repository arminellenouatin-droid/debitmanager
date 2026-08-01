import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [join(__dirname, 'modules', '**', '*.entity{.ts,.js}')],
  migrations: [join(__dirname, 'database', 'migrations', '*{.ts,.js}')],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DB_LOGGING', false),
  ssl: { rejectUnauthorized: false },
});
