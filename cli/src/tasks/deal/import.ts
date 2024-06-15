import * as dotenv from 'dotenv';
import { api, bigqueryV2 } from '@bi/bitrix24';
import { env } from '@bi/core';
dotenv.config();

const projectId = env.getGoogleProjectId();
const schema = bigqueryV2.schema.dealTable;
const destinationTable = bigqueryV2.table.getTableName(schema.name);
const writeClient = new bigqueryV2.writeStream.managedwriter.WriterClient({ projectId });

const dealsResponse = await api.listDeals();
console.log(`Got ${dealsResponse.result.length} deals`);

try {
  const result = await bigqueryV2.writeStream.upsertRowsWithDefaultStream(writeClient, destinationTable, dealsResponse.result);
  console.log(result);
} finally {
  writeClient.close();
}
