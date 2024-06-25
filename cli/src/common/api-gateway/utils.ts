import { ApiGatewayServiceClient } from '@google-cloud/api-gateway';
import { env } from '@bi/core';

export const currentVersionSuffix = 'v3';

export async function useConfig(client: ApiGatewayServiceClient, gatewayConfigId: string) {
  const [gateways] = await client.listGateways({
    parent: `projects/veloman-staging/locations/europe-west2`,
  });

  const projectId = env.getGoogleProjectId();
  const gatewayId = env.getGoogleCloudApiGatewayId();
  const gatewayApiId = env.getGoogleCloudApiGatewayApiId();
  const gatewayName = env.getGoogleCloudApiGatewayName();
  const gateway = gateways.find((g) => g.name === gatewayName);
  if (!gateway) {
    throw new Error(`Gateway ${gatewayName} not found`);
  }

  const gatewayConfigName = env.getGoogleCloudApiConfigName(gatewayConfigId);

  if (gateway.apiConfig?.replace(/projects\/\d+/, `projects/${projectId}`) === gatewayConfigName) {
    console.log(`Config already set to ${gatewayConfigId}, skipping update..`);
    process.exit(0);
  }

  const [op] = await client.updateGateway({
    updateMask: {
      paths: ['api_config'],
    },
    gateway: {
      name: `projects/veloman-staging/locations/europe-west2/gateways/${gatewayId}`,
      apiConfig: `projects/veloman-staging/locations/global/apis/${gatewayApiId}/configs/${gatewayConfigId}`,
    },
  });

  console.log(`Updating gateway config from ${gateway.apiConfig} to ${gatewayConfigName}`);
  await op.promise();
  console.log(`Config updated!`);
}
