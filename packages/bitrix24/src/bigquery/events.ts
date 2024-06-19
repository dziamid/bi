import type { Bitrix24Event, Deal } from '@bi/bitrix24/src/types';
import { getRecordIdFromEvent, isCreatedOrUpdatedEvent } from '@bi/bitrix24/src/api/utils';
import { getDeal } from '@bi/bitrix24/src/api/api';
import * as bq from '@bi/bigquery';
import { type WriterClient } from '@bi/bigquery';

export async function syncEvent(writeClient: WriterClient, destinationTable: string, event: Bitrix24Event) {
  const recordId = getRecordIdFromEvent(event);

  let data: Deal | undefined;

  if (isCreatedOrUpdatedEvent(event)) {
    data = await getDeal(recordId);
    if (!data) {
      throw new Error(`Record with ID ${recordId} not found`);
    }

    const rows = [
      {
        ID: data.ID,
        TITLE: data.TITLE,
        STAGE_ID: data.STAGE_ID,
        TYPE_ID: data.TYPE_ID,
      },
    ];

    return bq.stream.upsertRows(writeClient, destinationTable, rows);
  } else {
    const rows = [
      {
        ID: event.data.FIELDS.ID,
      },
    ];
    return bq.stream.deleteRows(writeClient, destinationTable, rows);
  }
}
