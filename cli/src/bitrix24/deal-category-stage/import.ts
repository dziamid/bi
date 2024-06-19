import * as dotenv from 'dotenv';
import { api, bigqueryV2 } from '@bi/bitrix24';
import { env } from '@bi/core';

dotenv.config();

const projectId = env.getGoogleProjectId();
const meta = bigqueryV2.meta.dealCategoryStageTable;
const destinationTable = bigqueryV2.table.getTableName(meta.name);
const writeClient = new bigqueryV2.writeStream.managedwriter.WriterClient({ projectId });

const listDealCategoryStageResult = await api.listDealCategoryStage();
console.log(`Got ${listDealCategoryStageResult.result.length} stages`);

try {
  const result = await bigqueryV2.writeStream.upsertRows(writeClient, destinationTable, listDealCategoryStageResult.result);
  console.log(result);
} finally {
  writeClient.close();
}
