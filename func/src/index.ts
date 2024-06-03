import express from 'express';
import * as dotenv from 'dotenv';
import * as bitrix24 from './bitrix24';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/bitrix24/ingest', bitrix24.ingest);

export const api3 = app;
