// https://b24-x3gqgt.bitrix24.by/rest/1/phdahz5gpjz0hl37/crm.deal.list.json

import * as dotenv from 'dotenv';
import { bigquery } from '@bi/bitrix24';

dotenv.config();

const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';
const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const bq = new bigquery.BigQuery();

await bigquery.deleteTable(bq, datasetId, tableId);
console.log(`Table ${destinationTable} deleted`);
console.log(`Table ${destinationTable} created`);
await bigquery.createTable(bq, datasetId, tableId, bigquery.dealsTable);
