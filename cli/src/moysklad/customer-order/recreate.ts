import * as dotenv from 'dotenv';
import * as moysklad from '@bi/moysklad';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = moysklad.bigquery.datasetId
const meta = moysklad.bigquery.customerOrderTable;
const bqClient = new bq.BigQuery();
await bq.table.recreateTable(bqClient, datasetId, meta.name, meta);
