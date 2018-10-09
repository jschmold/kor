import { ConnectionOptions } from 'typeorm';
import { LoadModule } from './module';
import { LogLevel, restoreLogging, initializeLogging } from './logging';
import { verifyMode, verifySecret, verifyVerbosity, verifyPort } from './settings';
import { readFileSync } from 'fs';
import { join } from 'path';
import { safeLoad } from 'js-yaml';

import * as express from 'express';

export interface IKorApplicationSettings {
  mode: 'development' | 'production';
  port: number | 8080;
  dataConfigs: string | 'databases';
  dataSources?: {
    name: string,
    file: string 
  }[];
  verbosity?: LogLevel
  secret: string;
}

export class KorApplication {

  settings: IKorApplicationSettings = {
    mode: 'development',
    port: 8080,
    dataConfigs: 'databases',
    verbosity: 'warn',
    secret: ''
  };

  router = express();
  dataConnections = new Map<string, ConnectionOptions>();

  constructor(arg: IKorApplicationSettings) {
    this.settings = { ...this.settings, ...arg };
    verifySettings(this);

    restoreLogging();
    initializeLogging(this.settings);

    for(let source of this.settings.dataSources!) {
      let path = join(this.settings.dataConfigs, `${source.file.includes('yaml') ? source.file : source.file + '.yaml' }`);
      let yaml = safeLoad(readFileSync(path, 'utf8'))
      if (yaml == null) throw new Error(`Unable to load ${path} for data config`);
      this.dataConnections.set(source.name, yaml)
    }
  }

  /**
   * Does the conf data sources have the key
   * @ignore
   */
  confIncludesSource(key: string) {
    if (this.settings.dataSources == null)
      throw new Error('dataSources is undefined');
    return this.settings.dataSources.map(obj => obj.name).indexOf(key) > -1;
  }

  listen() {
    let port = this.settings.port || 8080;
    console.debug('Pre-listen, intended port ', port);
    this.router.listen(this.settings, () => {
      console.info('Server running on port', port);
    });
  }

  /**
   * Does the connections object have the source
   * @ignore
   */
  includesSource(key: string) {
    return this.dataConnections.has(key);
  }

  /**
   * Of the data sources that have been loaded, load the source name
   * @param source
   */
  getConnectionDetails(source: string) {
    return this.dataConnections.get(source);
  }

  loadModules(mods: Function[]) {
    mods.forEach(LoadModule);
  }
}

function verifySettings(app: KorApplication) {
  if (verifyMode(app.settings.mode) !== true) {
    throw new Error(`Invalid mode ${app.settings.mode}`);
  }

  if (verifyPort(app.settings.port) !== true) {
    throw new Error(`Invalid port ${app.settings.port}`);
  }

  if (verifySecret(app.settings.secret) !== true) {
    throw new Error(`Invalid secret ${app.settings.secret}. Needs to be >48 characters`);
  }

  if (verifyVerbosity(app.settings.verbosity!) !== true) {
    throw new Error(`Invalid verbosity ${app.settings.verbosity}`);
  }

}
