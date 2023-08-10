export class RequiredArgError extends Error {
  constructor(args?: Array<string>) {
    super(`missing required arguments${args ? ': ' + args.join(' ,') : ''}.`);
  }
}
