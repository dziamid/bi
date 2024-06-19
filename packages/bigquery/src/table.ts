import { BigQuery } from '@google-cloud/bigquery';
import type { TableMetadata } from '@google-cloud/bigquery/build/src/table';

export function getTablePath(projectId: string, datasetId: string, tableId: string) {
  return `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
}

export function createTable(bigquery: BigQuery, datasetId: string, tableId: string, metadata: TableMetadata) {
  return bigquery.dataset(datasetId).createTable(tableId, metadata);
}

export function deleteTable(bigquery: BigQuery, datasetId: string, tableId: string) {
  const table = bigquery.dataset(datasetId).table(tableId);
  return table.delete().catch((err) => {
    if (/Not found/.test(err.message)) {
      console.log(`Table ${table.id} not found, skipping delete`);
      return;
    } else {
      throw err;
    }
  });
}

export async function recreateTable(bigquery: BigQuery, datasetId: string, tableId: string, metadata: TableMetadata) {
  await deleteTable(bigquery, datasetId, tableId);
  console.log(`Table ${tableId} deleted`);
  const result = await createTable(bigquery, datasetId, tableId, metadata);
  console.log(`Table ${tableId} created`);

  return result;
}