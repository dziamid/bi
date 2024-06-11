import {type Request, type Response} from 'express';
import {encoders, env, types} from '@bi/bitrix24';
import {CloudTasksClient} from '@google-cloud/tasks';

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
  const event = req.body as types.Bitrix24Event;

  const projectId = env.getGoogleProjectId();
  const location = env.getGoogleCloudTasksLocation();
  const tasks = new CloudTasksClient();

  const queuePath = tasks.queuePath(projectId, location, 'bitrix24');
  console.log(`Creating task in queue: ${queuePath}`);

  const [task] = await tasks.createTask({
    parent: queuePath,
    task: {
      httpRequest: {
        httpMethod: 'POST',
        url: `${env.getEnvVar('FUNCTION_URL')}/bitrix24/enrich`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: encoders.jsonToBase64(event),
      },
    },
  });

  console.log(`Created bitrix24 task to enrich event: ${task.name}`);

  res.status(200).send('OK');
};
