import * as dotenv from 'dotenv';
import * as moysklad from '@bi/moysklad';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = moysklad.bigquery.datasetId;
const metadata = moysklad.bigquery.customerOrderTable;
const tableId = metadata.name;

const bqClient = new bq.BigQuery();
const table = bqClient.dataset(datasetId).table(tableId);
await table.setMetadata(metadata);
