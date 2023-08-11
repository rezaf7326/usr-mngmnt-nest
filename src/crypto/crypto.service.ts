import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoUtility } from './crypto.utility';

@Injectable()
export class CryptoService {
  constructor(private configService: ConfigService) {
    CryptoUtility.setup(configService);
  }

  generateUUID(): string {
    return CryptoUtility.generateUUID();
  }

  generateRandomString(size: number): string {
    return CryptoUtility.generateRandomString(size);
  }

  generateEncryptionKey() {
    return CryptoUtility.generateEncryptionKey();
  }

  encryptString(str: string, key?: string | Buffer): string {
    return CryptoUtility.encryptString(str, key);
  }

  decryptString(str: string, key?: string | Buffer): string {
    return CryptoUtility.decryptString(str, key);
  }

  hashPassword(password: string): Promise<string> {
    return CryptoUtility.hashPassword(password);
  }

  verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return CryptoUtility.verifyPassword(password, hashedPassword);
  }

  hash(str: string | Buffer, algorithm?: string): string {
    return CryptoUtility.hash(str, algorithm);
  }
}
