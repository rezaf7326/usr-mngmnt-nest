import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      database: 'postgres',
      username: 'postgres',
      password: 'pass123',
      autoLoadEntities: true,
      synchronize: true, // TODO disable
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
