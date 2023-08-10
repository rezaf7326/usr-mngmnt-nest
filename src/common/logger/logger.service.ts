import { LogLevel } from './log-level';
import { LogColor } from './log-color';

export class LoggerService {
  private readonly className: string;
  private readonly level: LogLevel;
  constructor(obj: any, level?: LogLevel) {
    this.className = typeof obj === 'string' ? obj : obj.constructor.name;
    const logLevel =
      level || (process.env.LOG_LEVEL && Number(process.env.LOG_LEVEL));
    this.level = typeof logLevel === 'number' ? logLevel : LogLevel.debug;
  }

  silly(message: string, detail?: any) {
    if (this.level === LogLevel.silly) {
      this.log(LogColor.FgMagenta, message, detail);
    }
  }

  debug(message: string, detail?: any) {
    if (this.level <= LogLevel.debug) {
      this.log(LogColor.FgBlue, message, detail);
    }
  }

  verbose(message: string, detail?: any) {
    if (this.level <= LogLevel.verbose) {
      this.log(LogColor.FgCyan, message, detail);
    }
  }

  warn(message: string, detail?: any) {
    if (this.level <= LogLevel.warn) {
      this.log(LogColor.FgYellow, message, detail);
    }
  }

  info(message: string, detail?: any) {
    if (this.level <= LogLevel.info) {
      this.log(LogColor.FgGreen, message, detail);
    }
  }

  error(message: string, detail?: any) {
    this.log(LogColor.FgRed, message, detail);
  }

  private log(color: LogColor, message: string, detail?: any) {
    console.log(
      `${color}timestamp: ${Date.now()} - [${this.className}]: ${message}${
        detail ? ' ' + JSON.stringify(detail, null, 2) : ''
      }${LogColor.Reset}`,
    );
  }
}
