import { BigQuery } from '@google-cloud/bigquery';
import type { TableMetadata } from '@google-cloud/bigquery/build/src/table';
import { env } from '@bi/core';
import { datasetId } from './config';

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

export function createTable(bigquery: BigQuery, datasetId: string, tableId: string, metadata: TableMetadata) {
  return bigquery.dataset(datasetId).createTable(tableId, metadata);
}

export function getTableName(tableId: string) {
  const projectId = env.getGoogleProjectId();

  return `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
}
