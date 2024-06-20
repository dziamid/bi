import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';
dotenv.config();

const datasetId = bitrix24.bigquery.datasetId;
const dealTable = bitrix24.bigquery.dealTable;
const bqClient = new bq.BigQuery();
const table = bqClient.dataset(datasetId).table(dealTable.name);
const meta = await table.getMetadata();
console.log(JSON.stringify(meta, null, 4));
