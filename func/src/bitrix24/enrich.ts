import {type Request, type Response} from 'express';
import {bigqueryV2, types, utils} from '@bi/bitrix24';
import {env} from '@bi/core';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const enrich = async (req: Request, res: Response) => {
  const event: types.Bitrix24Event = req.body;
  const model = utils.getModelFromEvent(event);
  const eventType = utils.getEventTypeFromEvent(event);
  const projectId = env.getGoogleProjectId();
  const datasetId = 'bitrix24';
  const tableId = 'deals';
  const destinationTable = `projects/${projectId}/datasets/${datasetId}/tables/${tableId}`;
  const writeClient = new bigqueryV2.writeStream.managedwriter.WriterClient({ projectId });

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

  await bigqueryV2.writeStream.syncEventToBigquery(writeClient, destinationTable, event);
  writeClient.close();

  res.status(200).send('OK');
};
