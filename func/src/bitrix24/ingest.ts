import {type Request, type Response} from 'express';
import {getEnvVar, getGoogleCloudTasksLocation, getGoogleProjectId} from '../utils/env';
import {jsonToBase64} from './utils/encoders';
import {CloudTasksClient} from '@google-cloud/tasks';
import type {Bitrix24Event} from './utils/types';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const ingest = async (req: Request, res: Response) => {
  console.log(`[ingest] req: ${JSON.stringify(req.body)}`);

  if (!req.body) {
    res.status(400).send('Bad Request');
    return;
  }
  const event = req.body as Bitrix24Event;

  const projectId = getGoogleProjectId();
  const location = getGoogleCloudTasksLocation();
  const tasks = new CloudTasksClient();

  const queuePath = tasks.queuePath(projectId, location, 'bitrix24');
  console.log(`Creating task in queue: ${queuePath}`);

  const [task] = await tasks.createTask({
    parent: queuePath,
    task: {
      httpRequest: {
        httpMethod: 'POST',
        url: `${getEnvVar('FUNCTION_URL')}/bitrix24/enrich`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonToBase64(event),
      },
    },
  });

  console.log(`Created bitrix24 task to enrich event: ${task.name}`)

  res.status(200).send('OK');
};
