import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    DatabaseModule,
    AuthModule,
    UserModule,
    ClientModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
