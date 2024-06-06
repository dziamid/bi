import {type Request, type Response} from 'express';
import type {Bitrix24Event} from './utils/types';
import {getEventTypeFromEvent, getModelFromEvent} from './utils/utils';
import {syncEventToBigquery} from './utils/bigquery';
import {BigQuery} from '@google-cloud/bigquery';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const enrich = async (req: Request, res: Response) => {
  const bigquery = new BigQuery();
  const event: Bitrix24Event = req.body;
  const model = getModelFromEvent(event);
  const eventType = getEventTypeFromEvent(event);

  if (eventType === 'unknown') {
    console.log(`Ignoring unknown event type in event: '${event.event}`);
    res.status(200).send('OK');
    return;
  }

  if (model === 'unknown') {
    console.log(`Ignoring unknown model in event: '${event.event}`);
    res.status(200).send('OK');
    return;
  }

  await syncEventToBigquery(bigquery, event);

  res.status(200).send('OK');
};
