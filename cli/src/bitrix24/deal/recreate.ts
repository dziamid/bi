import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = bitrix24.bigquery.datasetId;
const dealTable = bitrix24.bigquery.dealTable;
const bqClient = new bq.BigQuery();
await bq.table.recreateTable(bqClient, datasetId, dealTable.name, dealTable);
