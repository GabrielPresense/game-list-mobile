"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const items_module_1 = require("./modules/items/items.module");
const lists_module_1 = require("./modules/lists/lists.module");
const auth_module_1 = require("./modules/auth/auth.module");
const item_entity_1 = require("./common/entities/item.entity");
const list_entity_1 = require("./common/entities/list.entity");
const user_entity_1 = require("./common/entities/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: process.env.DATABASE_TYPE === 'postgres' ? 'postgres' : 'sqlite',
                    database: process.env.DATABASE_URL || 'database.sqlite',
                    entities: [item_entity_1.Item, list_entity_1.List, user_entity_1.User],
                    synchronize: process.env.NODE_ENV !== 'production',
                    logging: process.env.NODE_ENV === 'development',
                    ...(process.env.DATABASE_TYPE === 'postgres' && {
                        url: process.env.DATABASE_URL,
                        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
                    }),
                }),
            }),
            auth_module_1.AuthModule,
            items_module_1.ItemsModule,
            lists_module_1.ListsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map