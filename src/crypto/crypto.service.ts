import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly saltRounds = 10;

  generateUUID(): string {
    return crypto.randomUUID();
  }

  generateRandomString(size: number): string {
    return crypto.randomBytes(size).toString('base64').slice(0, size);
  }

  generateEncryptionKey() {
    return crypto.randomBytes(32);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // encryptString(str: string, key?: string | Buffer): string {}
  // decryptString(str: string, key?: string | Buffer): string {}
}
