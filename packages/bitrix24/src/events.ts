import { type Bitrix24Event, type Deal } from './types';
import type { WriterClient } from '@bi/bigquery';
import * as bq from '@bi/bigquery';
import { getDeal } from './api';

export const knownModels = ['deal'];

export function isKnownModel(model: string): boolean {
  return knownModels.includes(model);
}

export function getModelFromEvent(event: Bitrix24Event): 'deal' | 'unknown' {
  if (/DEAL/.test(event.event)) {
    return 'deal';
  } else {
    return 'unknown';
  }
}

export function getRecordIdFromEvent(event: Bitrix24Event) {
  return event.data.FIELDS.ID;
}

export function getEventTypeFromEvent(event: Bitrix24Event): 'create' | 'update' | 'delete' | 'unknown' {
  if (/UPDATE$/.test(event.event)) {
    return 'update';
  } else if (/CREATE$/.test(event.event)) {
    return 'create';
  } else if (/DELETE$/.test(event.event)) {
    return 'delete';
  } else {
    return 'unknown';
  }
}

export function isCreatedOrUpdatedEvent(event: Bitrix24Event): boolean {
  const eventType = getEventTypeFromEvent(event);

  return eventType === 'create' || eventType === 'update';
}

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
