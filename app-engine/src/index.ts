import express from 'express';
import * as dotenv from 'dotenv';
import { Message, PubSub } from '@google-cloud/pubsub';
import { BigQuery } from '@google-cloud/bigquery';
import { getGoogleProjectId } from './utils';
import type { Bitrix24Event } from './bitrix24/utils/types';
import { getModelFromEvent, getRecordIdFromEvent, isCreatedOrUpdatedEvent } from './bitrix24/utils/utils';
import { batchGetDeals } from './bitrix24/utils/api';
import { createUpdateOrDeleteDeal } from './bitrix24/utils/bigquery';

dotenv.config();

const app = express();
app.use(express.json());
const pubsub = new PubSub();
const bigquery = new BigQuery();
const projectId = getGoogleProjectId();
let messages: Message[] = [];
let isProcessing = false;
let isShuttingDown = false;
const subscription = pubsub.subscription(`projects/${projectId}/subscriptions/bitrix24-ingest-sub`);

subscription.on('message', (message: Message) => {
  if (isShuttingDown) {
    // If shutting down, do not accept new messages
    message.nack();
    return;
  }

  messages.push(message);
  message.ack();
});

const processingInterval = setInterval(async () => {
  console.log(`Processing messages`);
  if (isProcessing) {
    console.log(`Previous processing still in progress. Skipping...`)
    return;
  }
  if (messages.length === 0) {
    console.log(`No messages to process. Skipping...`);
    return;
  }

  isProcessing = true;

  try {
    const batch = messages.splice(0, 50);
    console.log(`Processing batch of ${batch.length} messages`);
    const events = batch.map((message) => JSON.parse(message.data.toString()) as Bitrix24Event);
    console.log(`Received events: ${JSON.stringify(events)}`);
    const dealEvents = events.filter((e) => getModelFromEvent(e) === 'deal');
    const modelIdsToFetch = dealEvents.filter((e) => isCreatedOrUpdatedEvent(e)).map((e) => getRecordIdFromEvent(e));
    const deals = await batchGetDeals(modelIdsToFetch);
    console.log(`Deal records loaded: ${JSON.stringify(deals)}`);
    for (const message of messages) {
      const event = JSON.parse(message.data.toString()) as Bitrix24Event;
      await createUpdateOrDeleteDeal(
        bigquery,
        event,
        deals.find((d) => d.ID === getRecordIdFromEvent(event))
      );
      message.ack();
    }
  } catch (error) {
    console.error('Error processing events:', error);
  } finally {
    isProcessing = false;
  }
}, 1000);

// Listen to the App Engine-specified port, or 8082 otherwise
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

async function gracefulShutdown() {
  console.log('Starting graceful shutdown...');
  isShuttingDown = true;

  // Stop receiving new messages
  await subscription.close();

  // Wait for any ongoing processing to finish
  while (isProcessing) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Clear the interval
  clearInterval(processingInterval);

  console.log('Graceful shutdown complete.');
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

export const api3 = app;
