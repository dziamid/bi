# Adding new env

Create a new CGP project for the env

Register a new configuration:

    `gcloud config configurations create bi-<env-name>`

Set project for the new configuration:

    `gcloud config set project <google-project-id>`

Add env file and set google project id:

    `echo "GOOGLE_PROJECT_ID=<google-project-id>" > env/<env-name>`

Add npm task to switch env:

```
    "env:<env-name>": "tsx ./src/env.ts <env-name>"    
```

# Switching between envs locally:

    `cd cli && npm run env:<env-name>`

# Creating new app-engine app

    `gcloud app create --region=europe-west3`

