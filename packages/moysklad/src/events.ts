import type { SingleEvent } from './types';

export const knownModels = ['customerorder'] as const;
export type KnownModel = typeof knownModels[number];

export function getRecordIdFromEvent(event: SingleEvent) {
  return event.event.meta.href.split('/').pop() as string;
}

export function getModelFromEvent(event: SingleEvent): KnownModel | 'unknown' {
  const model = event.event.meta.type as KnownModel;
  if (knownModels.includes(model)) {
    return model;
  } else {
    return 'unknown';
  }
}

export function getEventTypeFromEvent(event: SingleEvent): 'create' | 'update' | 'unknown' {
  const action = event.event.action;

  if (action === 'CREATE') {
    return 'create';
  } else if (action === 'UPDATE') {
    return 'update';
  } else {
    return 'unknown';
  }
}

