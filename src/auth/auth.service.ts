import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptoService } from '../crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    const isValid = await this.cryptoService.verifyPassword(
      password,
      user.passwordHash,
    );
    if (!isValid) {
      throw new UnauthorizedException('invalid password');
    }

    return {
      accessToken: await this.jwtService.signAsync({
        email: user.email,
        sub: user.id,
      }),
    };
  }
}
