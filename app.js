const express = require('express');
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client();
const githubWebhookHandler = require('github-webhook-handler');
const handler = githubWebhookHandler({ path: '/webhook', secret: process.env.GITHUB_WEBHOOK_SECRET });

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

app.post('/webhook', (req, res) => {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  });
});

const server = app.listen(7777, () => {
  console.log('Server running at http://localhost:7777/');
});
