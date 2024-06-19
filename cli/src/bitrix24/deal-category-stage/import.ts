import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import { api } from '@bi/bitrix24';
import { env } from '@bi/core';
import * as bq from '@bi/bigquery';

dotenv.config();

const projectId = env.getGoogleProjectId();
const datasetId = bitrix24.datasetId;
const meta = bitrix24.bigquery.meta.dealCategoryStageTable;
const destinationTable = bq.table.getTablePath(projectId, datasetId, meta.name);
const writeClient = new bq.stream.WriterClient({ projectId });

const listDealCategoryStageResult = await api.listDealCategoryStage();
console.log(`Got ${listDealCategoryStageResult.result.length} stages`);

try {
  const result = await bq.stream.upsertRows(writeClient, destinationTable, listDealCategoryStageResult.result);
  console.log(result);
} finally {
  writeClient.close();
}
