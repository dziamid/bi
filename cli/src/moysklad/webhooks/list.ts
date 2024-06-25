import * as dotenv from 'dotenv';
import { env } from '@bi/core';
import * as moysklad from '@bi/moysklad';
import { uniq } from 'ramda';

dotenv.config();

const projectId = env.getGoogleProjectId();
const webhooks = await moysklad.api.listWebhooks();
console.log(`Found ${webhooks.rows.length} webhooks`);
const urls = uniq(webhooks.rows.map(r => r.url));
console.log(`Found ${urls.length} unique urls: ${urls.join(', ')}`);

