import * as dotenv from 'dotenv';
import { bigqueryV2 } from '@bi/bitrix24';

dotenv.config();

const datasetId = bigqueryV2.config.datasetId;
const schema = bigqueryV2.schema.dealTable;
const tableId = schema.name;
const destinationTable = bigqueryV2.table.getTableName(tableId);

const bq = new bigqueryV2.BigQuery();

await bigqueryV2.table.deleteTable(bq, datasetId, tableId);
console.log(`Table ${destinationTable} deleted`);
await bigqueryV2.table.createTable(bq, datasetId, tableId, schema);
console.log(`Table ${destinationTable} created`);
