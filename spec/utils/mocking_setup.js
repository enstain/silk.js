import {env, ENV, inject} from 'mocktail';
env(ENV.TESTING);

import MockAPI from './modules/mockAPI';
inject('API', MockAPI);