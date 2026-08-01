"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const path_1 = require("path");
const databaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [(0, path_1.join)(__dirname, 'modules', '**', '*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, 'database', 'migrations', '*{.ts,.js}')],
    synchronize: configService.get('DB_SYNCHRONIZE', false),
    logging: configService.get('DB_LOGGING', false),
    ssl: { rejectUnauthorized: false },
});
exports.databaseConfig = databaseConfig;
//# sourceMappingURL=database.config.js.map