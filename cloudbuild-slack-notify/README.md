### Deploy

```
export SLACK_WEBHOOK_URL="..."
gcloud functions deploy subscribeSlack --trigger-topic cloud-builds --runtime nodejs10 --set-env-vars "SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL"
```
