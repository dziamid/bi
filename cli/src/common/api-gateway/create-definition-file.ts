import * as dotenv from 'dotenv';
import { env } from '@bi/core';
import { writeFile } from 'node:fs/promises';

dotenv.config();

const definition = `
swagger: '2.0'
info:
  title: Webhooks API
  version: '1.0.0'
paths:
  /bitrix24:
    post:
      x-google-backend:
        address: ${env.getEnvVar('FUNCTION_URL')}/bitrix24/ingest
      summary: "Proxy all POST requests"
      operationId: "bitrix24.post"
      responses:
        '200':
          description: "A successful response"
  /moysklad:
    post:
      x-google-backend:
        address: ${env.getEnvVar('FUNCTION_URL')}/moysklad/ingest
      summary: "Proxy all POST requests"
      operationId: "moysklad.post"
      responses:
        '200':
          description: "A successful response"
`.trim();

await writeFile(`./src/common/api-gateway/dist/webhooks.${env.getEnvVar('ENV')}.yaml`, definition, 'utf8');
