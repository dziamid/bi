import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

async function run() {
  const env = process.argv[2] as string;
  if (!['staging', 'production'].includes(env)) {
    throw new Error(`Unexpected env: ${env}, expecting: staging or production`);
  }

  const envSource = `../env/${env}`;
  console.log(`Loaded env\n: ${readFileSync(envSource, 'utf-8')}`);
  runCommand(`gcloud config configurations activate bi-${env}`);

  runCommand(`cp ${envSource} ../func/.env`);
  runCommand(`cp ${envSource} ../app-engine/.env`);

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
