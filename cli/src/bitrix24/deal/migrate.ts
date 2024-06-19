import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = bitrix24.datasetId;
const metadata = bitrix24.bigquery.meta.dealTable;
const tableId = metadata.name;

const bqClient = new bq.BigQuery();
const table = bqClient.dataset(datasetId).table(tableId);
await table.setMetadata(metadata);
