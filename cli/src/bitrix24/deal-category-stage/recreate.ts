import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';

dotenv.config();

const datasetId = bitrix24.bigquery.datasetId;
const dealCategoryStageTable = bitrix24.bigquery.dealCategoryStageTable;
const bqClient = new bq.BigQuery();
await bq.table.recreateTable(bqClient, datasetId, dealCategoryStageTable.name, dealCategoryStageTable);
