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
  const model = bitrix24.events.getModelFromEvent(event);
  const eventType = bitrix24.events.getEventTypeFromEvent(event);
  const projectId = env.getGoogleProjectId();
  const datasetId = bitrix24.bigquery.datasetId;
  const dealTable = bitrix24.bigquery.dealTable;
  const writeClient = new bq.stream.WriterClient({ projectId });
  const destinationTable = bq.table.getTablePath(projectId, datasetId, dealTable.name);

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
  await bitrix24.events.syncEvent(writeClient, destinationTable, event);
  writeClient.close();

  res.status(200).send('OK');
};
