import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = bitrix24.datasetId;
const meta = bitrix24.bigquery.meta.dealCategoryStageTable;
const tableId = meta.name;
const bqClient = new bq.BigQuery();
await bq.table.recreateTable(bqClient, datasetId, tableId, meta);
