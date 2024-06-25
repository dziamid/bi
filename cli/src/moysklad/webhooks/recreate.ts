import * as dotenv from 'dotenv';
import { env } from '@bi/core';
import * as moysklad from '@bi/moysklad';

dotenv.config();

const projectId = env.getGoogleProjectId();
const webhooks = await moysklad.api.listWebhooks();
console.log(webhooks.rows.length);
const webhooksP = webhooks.rows.map(row => moysklad.api.deleteWebhook(row.id));
await Promise.all(webhooksP);
console.log(`Deleted ${webhooksP.length} webhooks`);

const endpoint = `${env.getEnvVar('WEBHOOK_URL')}/moysklad`;

await moysklad.api.createWebhook(endpoint, 'customerorder', 'CREATE');
await moysklad.api.createWebhook(endpoint, 'customerorder', 'UPDATE');
await moysklad.api.createWebhook(endpoint, 'customerorder', 'DELETE');

console.log('Webhooks created');