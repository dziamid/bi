import * as dotenv from 'dotenv';
import { env } from '@bi/core';
import * as moysklad from '@bi/moysklad';
import * as bq from '@bi/bigquery';
import { format, parseISO } from 'date-fns';

dotenv.config();

const projectId = env.getGoogleProjectId();
const meta = moysklad.bigquery.customerOrderTable;
const tablePath = bq.table.getTablePath(projectId, moysklad.bigquery.datasetId, meta.name);
const writeClient = new bq.stream.WriterClient({ projectId });
const customerOrderResult = await moysklad.api.listCustomerOrder();

const getMetaId = moysklad.api.getMetaId;

const agentIds = customerOrderResult.rows.map((row) => getMetaId(row.agent.meta));
const agentsP = agentIds.map(moysklad.api.getCounterparty);
const agents = await Promise.all(agentsP);

const stateIds = customerOrderResult.rows.map((row) => getMetaId(row.state.meta));
const statesP = stateIds.map(moysklad.api.getCustomerOrderState);
const states = await Promise.all(statesP);

const customerOrders: moysklad.bigquery.CustomerOrder[] = customerOrderResult.rows.map((row) => {
  const agent = agents.find((agent) => agent.id === getMetaId(row.agent.meta));
  if (!agent) {
    throw new Error(`Agent missing for customer order: ${row.id}`);
  }

  const state = states.find((state) => state.id === getMetaId(row.state.meta));
  if (!state) {
    throw new Error(`State missing for customer order: ${row.id}`);
  }

  return {
    id: row.id,
    name: row.name,
    sum: row.sum,
    agentPhone: agent.phone,
    stateName: state.name,
    created: format(parseISO(row.created), 'yyyy-MM-dd HH:mm:ss'),
    updated: format(parseISO(row.updated), 'yyyy-MM-dd HH:mm:ss'),
  };
});

console.log(`Got ${customerOrders.length} customer orders`);
console.log(customerOrders);
try {
  const result = await bq.stream.upsertRows(writeClient, tablePath, customerOrders);
  console.log(result);
} finally {
  writeClient.close();
}
