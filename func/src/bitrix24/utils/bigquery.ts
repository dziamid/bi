import { BigQuery } from '@google-cloud/bigquery';
import { type BatchEvent, type Deal } from './types';

export async function createUpdateOrDeleteDeal(bigquery: BigQuery, event: BatchEvent, data?: Deal) {
  if (event.eventType === 'delete') {
    await deleteRecord(bigquery, 'bitrix24', 'deals', event.id);
  } else if (event.eventType === 'update' && data) {
    await updateRecord(bigquery, 'bitrix24', 'deals', data);
  } else if (event.eventType === 'create' && data) {
    await createRecord(bigquery, 'bitrix24', 'deals', data);
  }
}

export async function createRecord(bigquery: BigQuery, datasetId: string, tableId: string, data: Deal) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  await table.insert(data);

  console.log(`Created record with ID: ${data.ID}`);
}

export async function updateRecord(bigquery: BigQuery, datasetId: string, tableId: string, data: Deal) {
  const query = `
    UPDATE \`${datasetId}.${tableId}\`
    SET TITLE = @TITLE, STAGE_ID = @STAGE_ID, TYPE_ID = @TYPE_ID
    WHERE ID = @id
  `;

  const options = {
    query: query,
    params: {
      ID: data.ID,
      TITLE: data.TITLE,
      STAGE_ID: data.STAGE_ID,
      TYPE_ID: data.TYPE_ID,
    },
  };

  await bigquery.query(options);

  console.log(`Updated record with ID: ${data.ID}`);

}

export async function deleteRecord(bigquery: BigQuery, datasetId: string, tableId: string, id: string) {
  const query = `
    DELETE FROM \`${datasetId}.${tableId}\`
    WHERE id = @id
  `;

  const options = {
    query: query,
    params: {
      id: id,
    },
  };

  await bigquery.query(options);
  console.log(`Deleted record with ID: ${id}`);
}