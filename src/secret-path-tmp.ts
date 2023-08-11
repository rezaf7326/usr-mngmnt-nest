import { join, resolve } from 'path';

export const secretPath = () => join(resolve('.', '.secret'));
