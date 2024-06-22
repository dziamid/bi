import express from 'express';
import * as dotenv from 'dotenv';
import bitrix24 from './bitrix24';
import moysklad from './moysklad';
import logger from './middleware/logger';
import catchAll from './middleware/catch-all';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use('/moysklad', moysklad);
app.use('/bitrix24', bitrix24);
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});
app.use(catchAll);

export const api3 = app;
