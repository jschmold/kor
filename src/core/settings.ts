import { LogLevel } from './logging';

export function verifyVerbosity(lev: LogLevel) {
  let levels: LogLevel[] = [
    'debug', 'info', 'log', 'warn', 'error', 'silence'
  ];
  return levels.indexOf(lev) > -1;
}

export function verifyMode(mode: string) {
  return [ 'development', 'production' ].indexOf(mode) > -1;
}

export function verifySecret(str: string) {
  return str != null && str.length > 48;
}

export function verifyPort(port: number) {
  return port != null;
}
