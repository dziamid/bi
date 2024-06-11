import express from 'express';
import * as dotenv from 'dotenv';
import bitrix24 from './bitrix24';
import logger from './middleware/logger';
import catchAll from './middleware/catch-all';
import { sharedFunction, foo, bar, baz } from '@bi/shared';

sharedFunction();
foo();
bar();
baz();
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/bitrix24', bitrix24);
app.use(catchAll);

export const api3 = app;
