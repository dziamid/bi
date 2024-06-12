// https://b24-x3gqgt.bitrix24.by/rest/1/phdahz5gpjz0hl37/crm.deal.list.json

import * as dotenv from 'dotenv';
import { api, bigqueryCdc } from '@bi/bitrix24';

dotenv.config();


const projectId = 'veloman-staging';
const datasetId = 'bitrix24';
const tableId = 'deals';
const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
const writeClient = new bigqueryCdc.managedwriter.WriterClient({ projectId });

const dealsResponse = await api.listDeals();
console.log(`Got ${dealsResponse.result.length} deals`);

try {
  const result = await bigqueryCdc.upsertRowsWithDefaultStream(writeClient, destinationTable, dealsResponse.result);
  console.log(result);
} finally {
  writeClient.close();
}
