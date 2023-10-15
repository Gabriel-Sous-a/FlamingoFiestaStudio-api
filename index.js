// index.js

const Discord = require('discord.js');
const client = new Discord.Client();
const githubWebhookHandler = require('github-webhook-handler');
const handler = githubWebhookHandler({ path: '/api/webhook', secret: process.env.GITHUB_WEBHOOK_SECRET });

module.exports = (req, res) => {
  if (req.method === 'POST') {
    handler(req, res, function (err) {
      res.status(404).send('no such location');
    });
  } else {
    res.status(405).send('Method Not Allowed');
  }
  
  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.login(process.env.DISCORD_BOT_TOKEN);

  handler.on('pull_request', function (event) {
    const pr = event.payload.pull_request;
    const message = `New pull request opened: ${pr.title} by ${pr.user.login}\n${pr.html_url}`;
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
    if (channel) {
      channel.send(message);
    } else {
      console.error('The channel does not exist!');
    }
  });
};
