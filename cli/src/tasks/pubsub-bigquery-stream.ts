import { Encodings, PubSub } from '@google-cloud/pubsub';
import type { Deal } from '../types';

import avro from 'avro-js';

const pubsub = new PubSub();
const topic = pubsub.topic('projects/veloman-staging/topics/bitrix24-deals-bq');
const [topicMetadata] = await topic.getMetadata();

console.log(`Topic metadata: ${JSON.stringify(topicMetadata)}`);
const topicSchemaMetadata = topicMetadata.schemaSettings;
if (!topicSchemaMetadata) {
  throw new Error('No schema found on the topic.');
}

const record: Deal & {_CHANGE_TYPE: string} = {
  ID: '123',
  TITLE: 'Test record',
  STAGE_ID: 'NEW',
  TYPE_ID: 'GOOD',
  _CHANGE_TYPE: 'UPSERT'
};

// Get the topic metadata to learn about its schema encoding.

const schemaEncoding = topicSchemaMetadata.encoding;
console.log(`Schema encoding: ${schemaEncoding}`);
// Make an encoder using the official avro-js library.
const definition = topicSchemaMetadata.schema;
console.log(`Schema definition: ${definition}`);

const type = avro.parse({
  type: 'record',
  name: 'Deal',
  fields: [
    {
      name: 'ID',
      type: 'string',
    },
    {
      name: 'TITLE',
      type: 'string',
    },
    {
      name: 'TYPE_ID',
      type: 'string',
    },
    {
      name: 'STAGE_ID',
      type: 'string',
    },
    {
      name: '_CHANGE_TYPE',
      type: 'string',
    },
  ],
});

console.log(`Schema type: ${type}`);

let dataBuffer: Buffer | undefined;
switch (schemaEncoding) {
  case Encodings.Binary:
    dataBuffer = type.toBuffer(record);
    break;
  case Encodings.Json:
    dataBuffer = Buffer.from(type.toString(record));
    break;
  default:
    console.log(`Unknown schema encoding: ${schemaEncoding}`);
    break;
}

if (!dataBuffer) {
  throw new Error(`Invalid encoding ${schemaEncoding} on the topic`);
}

const messageId = await topic.publishMessage({ data: dataBuffer });

console.log(`Avro record ${messageId} published.`);
