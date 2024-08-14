import { ConfigModuleOptions } from '@nestjs/config';
import { appConfig } from './app';
// import { env } from 'process';

export const config: ConfigModuleOptions = {
  load: [appConfig],
  cache: true,
  isGlobal: true,
};

export const Logger = {
  allLogs: 'true',
};
