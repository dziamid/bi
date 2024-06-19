import {type Request, type Response} from 'express';
import * as bitrix24 from '@bi/bitrix24';
import {env} from '@bi/core';
import * as bq from '@bi/bigquery';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const enrich = async (req: Request, res: Response) => {
  const event: bitrix24.types.Bitrix24Event = req.body;
  const model = bitrix24.utils.getModelFromEvent(event);
  const eventType = bitrix24.utils.getEventTypeFromEvent(event);
  const projectId = env.getGoogleProjectId();
  const datasetId = bitrix24.datasetId;
  const tableId = bitrix24.bigquery.meta.dealTable.name;
  const writeClient = new bq.stream.WriterClient({ projectId });
  const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;

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

  await bitrix24.bigquery.events.syncEvent(writeClient, destinationTable, event);
  writeClient.close();

  res.status(200).send('OK');
};
