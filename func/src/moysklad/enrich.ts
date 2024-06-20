import { type Request, type Response } from 'express';
import * as moysklad from '@bi/moysklad';
import { env } from '@bi/core';
import * as bq from '@bi/bigquery';

export const enrich = async (req: Request, res: Response) => {
  const event: moysklad.types.SingleEvent = req.body;

  const model = moysklad.events.getModelFromEvent(event);
  if (model === 'unknown') {
    console.log(`Ignoring unknown model in event: '${event.event}`);
    res.status(200).send('OK');
    return;
  }

  const eventType = moysklad.events.getEventTypeFromEvent(event);
  if (eventType === 'unknown') {
    console.log(`Ignoring unknown event type in event: '${event.event}`);
    res.status(200).send('OK');
    return;
  }

  const projectId = env.getGoogleProjectId();
  const datasetId = moysklad.bigquery.datasetId;
  const recordId = moysklad.events.getRecordIdFromEvent(event);
  const customerOrderApi = await moysklad.api.getCustomerOrder(recordId);
  if (!customerOrderApi) {
    console.log(`Record with ID ${recordId} not found`);
    res.status(200).send('OK');
    return;
  }
  const customerOrder = await moysklad.api.mapCustomerOrder(customerOrderApi);
  const customerOrderTable = moysklad.bigquery.customerOrderTable;
  const writeClient = new bq.stream.WriterClient({ projectId });
  const destinationTable = bq.table.getTablePath(projectId, datasetId, customerOrderTable.name);
  await bq.stream.syncRow(writeClient, destinationTable, customerOrder, eventType);
  writeClient.close();

  res.status(200).send('OK');
};
