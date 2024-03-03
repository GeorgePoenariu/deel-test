import express from 'express';
import bodyParser from 'body-parser';

import { sequelize } from './model/model.js';
import route from './route/index.js';

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);
app.use('/', route);

export default app;
