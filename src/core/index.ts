import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { KorApplication } from './application';

export { Route, Routeable, RouteType, IRouteableOptions } from './controller';
export { Model } from './model';
export { ApplicationModule, IApplicationModuleOptions } from './module';

let korConfig = safeLoad(readFileSync('./kor.config.yaml', 'utf8'));

export let Kor = new KorApplication(korConfig);

