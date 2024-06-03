import { type BatchEvent, type Bitrix24Event } from './types';

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

export function isCreatedOrUpdatedEvent(event: BatchEvent): boolean {
  return event.eventType === 'create' || event.eventType === 'update';
}
