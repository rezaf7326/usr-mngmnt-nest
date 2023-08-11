import { join, resolve } from 'path';
import { readFileSync } from 'fs';

// this file only provides a temp solution for loading a
//  secret phrase and should be removed

export class SecretTmp {
  private static instance: SecretTmp;
  private static loadedSecret: Buffer;

  private constructor() {}

  static _instantiate() {
    if (!this.instance) {
      this.instance = new SecretTmp();
      SecretTmp.loadedSecret = readFileSync(
        process.env.SECRET_PATH || join(resolve('.', '.secret')),
      );
    }
  }

  static get secret(): Buffer {
    return SecretTmp.loadedSecret;
  }
}

// no need to instantiate anywhere else
SecretTmp._instantiate();
