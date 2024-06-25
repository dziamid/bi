import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parse } from 'dotenv';
import { currentVersionSuffix, useConfig } from './common/api-gateway/utils';
import { ApiGatewayServiceClient } from '@google-cloud/api-gateway';
import * as dotenv from "dotenv";

async function run() {
  const env = process.argv[2] as string;
  if (!['local', 'staging', 'production'].includes(env)) {
    throw new Error(`Unexpected env: ${env}, expecting: staging or production`);
  }

  const envSource = `../env/${env}`;

  console.log(`Using env vars:\n${readFileSync(envSource, 'utf-8')}`);
  const envVars = parse(readFileSync(envSource, 'utf-8'));
  const configuration = getEnvVar('GCLOUD_CONFIGURATION', envVars);

  runCommand(`gcloud config configurations activate ${configuration}`);
  runCommand(`cp ${envSource} .env`);
  runCommand(`cp ${envSource} ../func/.env`);

  dotenv.config();

  console.log(`Updating webhooks`);
  const client = new ApiGatewayServiceClient();
  const gatewayConfigId = `webhooks-${env}-${currentVersionSuffix}`;
  await useConfig(client, gatewayConfigId);
}

run()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.error(err);
  });

function runCommand(command: string) {
  console.log(`Executing: ${command}`);
  execSync(command);
}

function getEnvVar(name: string, source: Record<string, string>): string {
  const value = source[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}
