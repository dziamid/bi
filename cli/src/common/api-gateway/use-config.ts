import { ApiGatewayServiceClient } from '@google-cloud/api-gateway';
import * as dotenv from 'dotenv';
import { useConfig } from './utils';

dotenv.config();

const client = new ApiGatewayServiceClient();

const gatewayConfigId = process.argv[2];
if (!gatewayConfigId) {
  throw new Error(`Expected gatewayConfigId as first argument`);
}

await useConfig(client, gatewayConfigId);
