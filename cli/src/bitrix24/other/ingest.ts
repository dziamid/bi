import * as dotenv from 'dotenv';
import { CloudTasksClient } from '@google-cloud/tasks';
import * as bitrix24 from '@bi/bitrix24';
import { env } from '@bi/core';

dotenv.config();

async function run() {
  const projectId = env.getGoogleProjectId();
  const location = env.getGoogleCloudTasksLocation();
  const tasks = new CloudTasksClient();
  const event: bitrix24.types.Bitrix24Event = {
    event: 'ONCRMDEALUPDATE',
    event_id: '33',
    data: { FIELDS: { ID: '21' } },
    ts: '1717671506',
    auth: {
      domain: 'b24-x3gqgt.bitrix24.by',
      client_endpoint: 'https://b24-x3gqgt.bitrix24.by/rest/',
      server_endpoint: 'https://oauth.bitrix.info/rest/',
      member_id: 'b4cb1a09664d01dd5c4ca5228f924e95',
      application_token: 'ba1ecbehzjjogj8d1lcsrz0uzrurmtlx',
    },
  };
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
        body: bitrix24.encoders.jsonToBase64(event),
      },
    },
  });
}

run()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
  });
