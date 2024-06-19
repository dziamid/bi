import * as dotenv from 'dotenv';
import { bigqueryV2 } from '@bi/bitrix24';

dotenv.config();

const datasetId = bigqueryV2.config.datasetId;
const metadata = bigqueryV2.meta.dealTable;
const tableId = metadata.name;
const tablePath = bigqueryV2.table.getTableName(tableId);

const bq = new bigqueryV2.BigQuery();
const table = bq.dataset(datasetId).table(tableId);
const meta = await table.getMetadata();
console.log(JSON.stringify(meta, null, 4));
