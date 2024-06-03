import {PubSub} from '@google-cloud/pubsub';
import {type Request, type Response} from 'express';
import {getGoogleProjectId} from '../utils';

/**
 * Receives webhook events from Bitrix24 and publishes it to a Pub/Sub topic
 * @param req
 * @param res
 */
export const ingest = async (req: Request, res: Response) => {
  const projectId = getGoogleProjectId();
  const topic = `projects/${projectId}/topics/bitrix24-ingest`;
  const pubsub = new PubSub();

  try {
    if (!req.body) {
      res.status(400).send('No data received');
      return;
    }

    const data = Buffer.from(JSON.stringify(req.body));

    // Publish the message to the Pub/Sub topic
    await pubsub.topic(topic).publishMessage({ data });
    console.log(`Message published to ${topic}: ${data.toString()}`);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error publishing message:', error);
    res.status(500).send('Internal Server Error');
  }
};
