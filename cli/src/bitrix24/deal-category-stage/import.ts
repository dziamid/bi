import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import { api } from '@bi/bitrix24';
import { env } from '@bi/core';
import * as bq from '@bi/bigquery';

dotenv.config();

const projectId = env.getGoogleProjectId();
const datasetId = bitrix24.bigquery.datasetId;
const dealCategoryStageTable = bitrix24.bigquery.dealCategoryStageTable;
const destinationTable = bq.table.getTablePath(projectId, datasetId, dealCategoryStageTable.name);
const writeClient = new bq.stream.WriterClient({ projectId });

const listDealCategoryStageResult = await api.listDealCategoryStage();
console.log(`Got ${listDealCategoryStageResult.result.length} stages`);

try {
  const result = await bq.stream.upsertRows(writeClient, destinationTable, listDealCategoryStageResult.result);
  console.log(result);
} finally {
  writeClient.close();
}
