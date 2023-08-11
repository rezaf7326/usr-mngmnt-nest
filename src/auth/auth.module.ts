import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { CryptoModule } from '../crypto/crypto.module';
import { JwtModule } from '@nestjs/jwt';
import { readFileSync } from 'fs';

import { secretPath } from '../secret-path-tmp'; // TODO REMOVE

@Module({
  imports: [
    UserModule,
    CryptoModule,
    JwtModule.register({
      global: true,
      secret: readFileSync(secretPath()),
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
