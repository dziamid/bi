import { ApiGatewayServiceClient } from '@google-cloud/api-gateway';
import { env } from '@bi/core';
import * as dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';

dotenv.config();

const suffix = 'v3';
const client = new ApiGatewayServiceClient();

const [configs] = await client.listApiConfigs({
  parent: `projects/veloman-staging/locations/global/apis/webhooks-staging-api`,
});
console.log(configs);

const path = `./src/common/api-gateway/dist/webhooks.local.yaml`;
const contents = await readFile(path);
const apiConfigId = `webhooks-${env.getEnvVar('ENV')}-${suffix}`;
const [op] = await client.createApiConfig({
  parent: 'projects/veloman-staging/locations/global/apis/webhooks-staging-api',
  apiConfigId,
  apiConfig: {
    displayName: apiConfigId,
    openapiDocuments: [{ document: { path, contents } }],
  },
});

console.log(`Creating new config..`);
await op.promise();
console.log(`Config created!`);