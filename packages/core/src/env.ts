import {env} from "@bi/core/src/index";

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getGoogleProjectId() {
  return getEnvVar('GOOGLE_CLOUD_PROJECT');
}

export function getGoogleCloudTasksLocation() {
  return getEnvVar('GOOGLE_CLOUD_TASKS_LOCATION');
}

export function getGoogleCloudApiGatewayLocation() {
  return getEnvVar('GOOGLE_CLOUD_API_GATEWAY_LOCATION');
}

export function getGoogleCloudApiGatewayId() {
  return 'webhooks-staging';
}

export function getGoogleCloudApiGatewayApiId() {
  return 'webhooks-staging-api';
}

export function getGoogleCloudApiGatewayName() {
  const projectId = env.getGoogleProjectId();
  const gatewayId = getGoogleCloudApiGatewayId();
  const gatewayLocation = env.getGoogleCloudApiGatewayLocation();

  return `projects/${projectId}/locations/${gatewayLocation}/gateways/${gatewayId}`;
}

export function getGoogleCloudApiConfigName(configId: string) {
  const projectId = env.getGoogleProjectId();
  const apiId = getGoogleCloudApiGatewayApiId();

  return `projects/${projectId}/locations/global/apis/${apiId}/configs/${configId}`
}