import { BigQuery } from '@google-cloud/bigquery';
import { type Bitrix24Event, type Deal } from './types';
import { getEventTypeFromEvent, getRecordIdFromEvent } from './utils';

export async function createUpdateOrDeleteDeal(bigquery: BigQuery, event: Bitrix24Event, data?: Deal) {
  const eventType = getEventTypeFromEvent(event);
  const recordId = getRecordIdFromEvent(event);

  if (eventType === 'delete') {
    await deleteRecord(bigquery, 'bitrix24', 'deals', recordId);
  } else if (eventType === 'update' && data) {
    await updateRecord(bigquery, 'bitrix24', 'deals', data);
  } else if (eventType === 'create' && data) {
    await createRecord(bigquery, 'bitrix24', 'deals', data);
  }
}

export async function createRecord(bigquery: BigQuery, datasetId: string, tableId: string, data: Deal) {
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableId);

  const res = await table.insert(data);
  console.log(`Created record with ID: ${data.ID}`);
  return res;
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

  const res = await bigquery.query(options);

  console.log(`Updated record with ID: ${data.ID}`);

  return res;
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

  const res = await bigquery.query(options);
  console.log(`Deleted record with ID: ${id}`);

  return res;
}
