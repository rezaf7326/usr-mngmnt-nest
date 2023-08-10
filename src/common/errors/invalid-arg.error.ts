export class InvalidArgError extends Error {
  constructor(args: Array<string>) {
    super(`invalid arguments${args ? ': ' + args.join(' ,') : ''}.`);
  }
}
