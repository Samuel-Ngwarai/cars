import { DeepPartial } from 'ts-essentials';

import { IConfigObject } from './config-i';

const testConfig: DeepPartial<IConfigObject> = {
  LOG_LEVEL: 'crit',
  PORT: 3000,
};

export = testConfig;
