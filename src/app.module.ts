import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from '../mikro-orm.config';
import { DatabaseModule } from './shared/database/database.module';
import { AuthModule } from './app/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
