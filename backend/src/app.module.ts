import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './modules/items/items.module';
import { ListsModule } from './modules/lists/lists.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthController } from './health.controller';
import { Item } from './common/entities/item.entity';
import { List } from './common/entities/list.entity';
import { User } from './common/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Forçar SQLite para Railway por enquanto
        return {
          type: 'sqlite',
          database: 'database.sqlite',
          entities: [Item, List, User],
          synchronize: true, // Permitir sincronização para criar tabelas
          logging: process.env.NODE_ENV === 'development',
        };
      },
    }),
    AuthModule,
    ItemsModule,
    ListsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

