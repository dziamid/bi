import * as dotenv from 'dotenv';
import { api, bigqueryV2 } from '@bi/bitrix24';
import { env } from '@bi/core';
dotenv.config();
import { format, parseISO } from 'date-fns';

const projectId = env.getGoogleProjectId();
const meta = bigqueryV2.meta.dealTable;
const destinationTable = bigqueryV2.table.getTableName(meta.name);
const writeClient = new bigqueryV2.writeStream.managedwriter.WriterClient({ projectId });

const dealsResponse = await api.listDeals();
const deals = dealsResponse.result.map((deal) => {
  return {
    ...deal,
    DATE_CREATE: format(parseISO(deal.DATE_CREATE), 'yyyy-MM-dd HH:mm:ss'),
    DATE_MODIFY: format(parseISO(deal.DATE_MODIFY), 'yyyy-MM-dd HH:mm:ss'),
  }
});

console.log(deals);
console.log(`Got ${dealsResponse.result.length} deals`);

try {
  const result = await bigqueryV2.writeStream.upsertRows(writeClient, destinationTable, deals);
  console.log(result);
} finally {
  writeClient.close();
}
