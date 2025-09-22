import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './modules/items/items.module';
import { ListsModule } from './modules/lists/lists.module';
import { AuthModule } from './modules/auth/auth.module';
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
        const isPostgres = process.env.DATABASE_TYPE === 'postgres';
        
        if (isPostgres) {
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Item, List, User],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          };
        } else {
          return {
            type: 'sqlite',
            database: process.env.DATABASE_URL || 'database.sqlite',
            entities: [Item, List, User],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
          };
        }
      },
    }),
    AuthModule,
    ItemsModule,
    ListsModule,
  ],
})
export class AppModule {}

