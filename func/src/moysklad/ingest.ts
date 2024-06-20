import { type Request, type Response } from 'express';
import * as moysklad from '@bi/moysklad';
import { encoders, env } from '@bi/core';
import { CloudTasksClient } from '@google-cloud/tasks';

export const ingest = async (req: Request, res: Response) => {
  console.log(`[ingest] req: ${JSON.stringify(req.body)}`);

  if (!req.body) {
    res.status(400).send('Bad Request');
    return;
  }
  const batchEvent = req.body as moysklad.types.BatchEvent;

  const projectId = env.getGoogleProjectId();
  const location = env.getGoogleCloudTasksLocation();
  const tasks = new CloudTasksClient();

  const queuePath = tasks.queuePath(projectId, location, 'moysklad');
  console.log(`Creating task in queue: ${queuePath}`);

  const createEventsP = batchEvent.events.map((event) =>
    createTask(tasks, queuePath, {
      auditContext: batchEvent.auditContext,
      event,
    })
  );

  const results = await Promise.all(createEventsP);
  console.log(`Created ${results.length} tasks`);

  res.status(200).send('OK');
};

async function createTask(tasks: CloudTasksClient, queuePath: string, event: moysklad.types.SingleEvent) {
  return tasks.createTask({
    parent: queuePath,
    task: {
      httpRequest: {
        httpMethod: 'POST',
        url: `${env.getEnvVar('FUNCTION_URL')}/moysklad/enrich`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: encoders.jsonToBase64(event),
      },
    },
  });
}
