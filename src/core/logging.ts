import { IKorApplicationSettings } from './application';
export type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error' | 'silence';

let nop = () => undefined;
let dbk = console.debug;
let lbk = console.log;
let ibk = console.info;
let wbk = console.warn;
let ebk = console.error;

export function restoreLogging() {
  console.debug = dbk.bind(console);
  console.log   = lbk.bind(console);
  console.info  = ibk.bind(console);
  console.warn  = wbk.bind(console);
  console.error = ebk.bind(console);
}

export function initializeLogging(settings: IKorApplicationSettings) {
  let level = settings.verbosity || 'warn';
  switch(level) {
    case 'silence': 
      console.error = nop;
    case 'error':
      console.warn = nop;
    case 'warn': 
      console.info = nop;
    case 'info':
      console.log = nop;
    case 'log':
      console.debug = nop;
    case 'debug':
    default:
      return;
  }
}


