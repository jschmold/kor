import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { KorApplication } from './application';

let korConfig = safeLoad(readFileSync('./kor.config.yaml', 'utf8'));

export let Kor = new KorApplication(korConfig);
