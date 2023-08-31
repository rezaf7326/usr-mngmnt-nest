import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';
import { PaymentModule } from './payment/payment.module';

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
    }),
    CryptoModule,
    AuthModule,
    PaymentModule,
  ],
})
export class AppModule {}
