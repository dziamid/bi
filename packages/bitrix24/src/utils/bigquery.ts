import { BigQuery } from '@google-cloud/bigquery';
import { type TableMetadata } from '@google-cloud/bigquery/build/src/table';

export { BigQuery };
export const dealsTable: TableMetadata = {
  tableConstraints: {
    primaryKey: { columns: ['ID'] },
  },
  schema: {
    fields: [
      { name: 'ID', type: 'STRING' },
      { name: 'TITLE', type: 'STRING' },
      { name: 'STAGE_ID', type: 'STRING' },
      { name: 'TYPE_ID', type: 'STRING' },
    ],
  },
};

export function deleteTable(bigquery: BigQuery, datasetId: string, tableId: string) {
  const table = bigquery.dataset(datasetId).table(tableId);
  return table.delete();
}

export function createTable(bigquery: BigQuery, datasetId: string, tableId: string, metadata: TableMetadata) {
  return bigquery.dataset(datasetId).createTable(tableId, metadata);
}
