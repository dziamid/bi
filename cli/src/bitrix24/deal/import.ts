import * as dotenv from 'dotenv';
import * as bitrix24 from '@bi/bitrix24';
import * as bq from '@bi/bigquery';
import { env } from '@bi/core';
import { format, parseISO } from 'date-fns';

dotenv.config();

const projectId = env.getGoogleProjectId();
const dealTable = bitrix24.bigquery.dealTable;
const destinationTable = bq.table.getTablePath(projectId, bitrix24.bigquery.datasetId, dealTable.name);
const writeClient = new bq.stream.WriterClient({ projectId });

const dealsResponse = await bitrix24.api.listDeals();
const deals = dealsResponse.result.map((deal) => {
  return {
    ...deal,
    DATE_CREATE: format(parseISO(deal.DATE_CREATE), 'yyyy-MM-dd HH:mm:ss'),
    DATE_MODIFY: format(parseISO(deal.DATE_MODIFY), 'yyyy-MM-dd HH:mm:ss'),
  };
});

console.log(deals);
console.log(`Got ${dealsResponse.result.length} deals`);

try {
  const result = await bq.stream.upsertRows(writeClient, destinationTable, deals);
  console.log(result);
} finally {
  writeClient.close();
}
