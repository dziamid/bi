import * as dotenv from 'dotenv';
import { env } from '@bi/core';
import * as moysklad from '@bi/moysklad';
import * as bq from '@bi/bigquery';

dotenv.config();

const projectId = env.getGoogleProjectId();
const meta = moysklad.bigquery.customerOrderTable;
const tablePath = bq.table.getTablePath(projectId, moysklad.bigquery.datasetId, meta.name);
const writeClient = new bq.stream.WriterClient({ projectId });
const customerOrdersApi = await moysklad.api.listCustomerOrder();
const customerOrdersP = customerOrdersApi.rows.map(row => moysklad.api.mapCustomerOrder(row));
const customerOrders = await Promise.all(customerOrdersP);
console.log(`Inserting ${customerOrders.length} customer orders`);

try {
  const result = await bq.stream.upsertRows(writeClient, tablePath, customerOrders);
  console.log(result);
} finally {
  writeClient.close();
}

