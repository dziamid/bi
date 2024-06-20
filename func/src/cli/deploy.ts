import { execSync } from 'node:child_process';

const command = `gcloud functions deploy api3 \
  --gen2 \
  --runtime nodejs20 \
  --trigger-http \
  --region=europe-west3 \
  --allow-unauthenticated \
  --service-account=function@veloman-staging.iam.gserviceaccount.com \
  --env-vars-file=.env.yaml
  --source=dist
`;

console.log(`Executing: ${command}`);
execSync(command);
