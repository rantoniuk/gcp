const { IncomingWebhook } = require('@slack/webhook');
const url = process.env.SLACK_WEBHOOK_URL;

const webhook = new IncomingWebhook(url);

// subscribeSlack is the main function called by Cloud Functions.
module.exports.subscribeSlack = (pubSubEvent, context) => {
  const build = eventToBuild(pubSubEvent.data);

  // Skip if the current status is not in the status list.
  // Add additional statuses to list if you'd like:
  // QUEUED, WORKING, SUCCESS, FAILURE,
  // INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return;
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

// createSlackMessage creates a message from a build object.
const createSlackMessage = (build) => {
  const start = new Date(build.startTime);
  const end = new Date(build.finishTime);
  SECONDS = Math.abs(end - start) / 1000
  var date = new Date(null);
  date.setSeconds(SECONDS);
  var duration = date.toISOString().substr(11, 8);

  const message = {
    text: `Build ID: \`${build.id}\` Commit: \`${build.substitutions.SHORT_SHA}\` Status: \`${build.status}\` Duration: \`${duration}\``,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build Logs',
        title_link: build.logUrl
      }
    ]
  };
  return message;
}
