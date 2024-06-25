import { ApiGatewayServiceClient } from '@google-cloud/api-gateway';
import * as dotenv from 'dotenv';
import { env } from '@bi/core';

dotenv.config();

const client = new ApiGatewayServiceClient();

const [gateways] = await client.listGateways({
  parent: `projects/veloman-staging/locations/europe-west2`,
});

const gatewayName = env.getGoogleCloudApiGatewayName();
const gateway = gateways.find((g) => g.name === gatewayName);
if (!gateway) {
  throw new Error(`Gateway ${gatewayName} not found`);
}

console.log(gateway);
