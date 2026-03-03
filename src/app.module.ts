import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import { AuthModule } from './app/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './app/auth/auth.guard';
import { UserModule } from './app/user/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    DatabaseModule,
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}
