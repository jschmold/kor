import { bindRouteable } from './controller';
import { bindModel } from './model';


export interface IApplicationModuleOptions {
  models?: Function[],
  controllers?: Function[]
}

export function ApplicationModule(opts: IApplicationModuleOptions) {
  return function(constructor: Function) {
    constructor.prototype._moduleOptions = opts;
  }
}

function getOpts(arg: Function) {
  let proto = arg.prototype || arg.constructor.prototype;
  let modOpts = proto._moduleOptions as IApplicationModuleOptions;
  if (modOpts == null || (modOpts.controllers == null && modOpts.models == null)) {
    console.warn('An empty module is being loaded'); 
  }
  return modOpts || { models: [], controllers: [] };
}

function getControllers(arg: IApplicationModuleOptions) {
  return arg.controllers || [];
}

function getModels(opts: IApplicationModuleOptions) {
  return opts.models || [];
}

export function LoadModule(arg: Function) {
  let opts = getOpts(arg);

  let models = getModels(opts);
  console.debug(`${models.length} models in ${arg.name}`);
  models.forEach(bindModel);

  let controllers = getControllers(opts);
  console.debug(`${controllers.length} controllers in ${arg.name}`);
  controllers.forEach(bindRouteable);
}
