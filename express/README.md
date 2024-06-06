# Restarting instance

Run to find out instance ID and VERSION:
    `gcloud app instances list --service=default`

Run to restart instance:
    `gcloud app instances delete <ID> --version=<VERSION> --service=default`

