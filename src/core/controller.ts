import { Router, RouterOptions, RequestHandler, ErrorRequestHandler } from 'express';
import { Kor } from '.';

export interface IRouteableOptions {
  baseUrl?: string
}

export type RouteType = 
  'all'
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete'

type RouteBinding = [RouteType, (string | RegExp)[], (RequestHandler | ErrorRequestHandler)[]]

interface IRouteableData {
  routes: RouteBinding[],
  baseUrl: string,
  options?: RouterOptions,
  parentRouter?: Router 
}

export function Routeable(baseUrl: string, parent?: Function, options?: RouterOptions | undefined) {
  console.debug(`New routeable ${baseUrl} | ${parent == null ? 'Root' : parent.name}`);
  return function(constructor: Function) {
    constructor.prototype._routing = {
      ... constructor.prototype._routing,
      options, baseUrl, parentRoute: parent,
    } as IRouteableData;
  }
}

export function Route(type: RouteType = 'all', arg: (string | RegExp)) {
  console.debug(`New route [${type}]${arg.toString()}`);
  // @ts-ignore
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let proto = target.prototype || target.constructor.prototype;

    if (proto._routing == null)  
      proto._routing = { routes: [] }
    if (Array.isArray(proto._routing.routes) === false)
      proto._routing.routes = [];
    
    proto._routing.routes.push([type, arg, descriptor.value]);
  }
}

export function bindRouteable(cls: Function) {
  let proto = (cls.prototype || cls.constructor.prototype);
  let routing = proto._routing as IRouteableData;
  let actor = Router(routing.options);
  let parent = routing.parentRouter || Kor.router;
  parent.use(routing.baseUrl, actor);

  console.debug(`[ROUTEABLE] ${cls.name} `);
  console.debug(`  ${routing.baseUrl}`)

  for(let route of routing.routes) {
    actor[route[0]](route[1], route[2]);
    console.debug(`  + [${route[0].toUpperCase()}] ${route[1]}`);
  }
}

