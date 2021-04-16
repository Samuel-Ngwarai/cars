import { IConfigObject } from './config-i';

const defaultConfig: IConfigObject = {
  PORT: 3000,
  LOG_LEVEL: 'info',
  MONGODB_URL: 'mongodb://root:rootpassword@localhost:27017'
};

export = defaultConfig;
