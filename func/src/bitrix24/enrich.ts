import {type Request, type Response} from 'express';
import * as bitrix24 from '@bi/bitrix24';
import {BigQuery} from '@google-cloud/bigquery';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const enrich = async (req: Request, res: Response) => {
  const bigquery = new BigQuery();
  const event: bitrix24.types.Bitrix24Event = req.body;
  const model = bitrix24.utils.getModelFromEvent(event);
  const eventType = bitrix24.utils.getEventTypeFromEvent(event);

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

  await bitrix24.bigquery.syncEventToBigquery(bigquery, event);

  res.status(200).send('OK');
};
