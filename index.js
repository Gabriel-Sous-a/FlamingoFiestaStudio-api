require("dotenv").config();

const { Client, Intents } = require("discord.js");
const express = require("express");

const app = express();

app.use(express.json());

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_BOT_TOKEN);

let messageID;

app.get("/", (req, res) => {
  const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  if (channel) {
    console.log("test");
    res.status(200).send("Sent a test message to Discord!");
  } else {
    console.error("The channel does not exist!");
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", (req, res) => {
  const event = req.body;
  const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  if (channel) {
    const MembersReviews = [
      "423232722534662176",
      "636224287887589376",
      "287779190613475339",
      "334054676527841281",
      "926266236491415552",
    ];
    let taggedString = "";

    MembersReviews.forEach((userId) => {
      taggedString += `<@${userId}> `;
    });

    if (event.action === "opened") {
      const pr = event.pull_request;
      const message = `New pull request opened: ${pr.title} by ${pr.user.login}\n ${taggedString} \n${pr.html_url}`;
      channel.send(message).then((msg) => {
        messageID = msg.id;
      });
    } else if (event.action === "reopened") {
      const pr = event.pull_request;
      const message = `Pull request reopened: ${pr.title} by ${pr.user.login}\n ${taggedString} \n${pr.html_url}`;
      channel.send(message).then((msg) => {
        messageID = msg.id;
      });
    } else if (event.action === "closed") {
      try {
        deleteMessage();
      } catch (error) {
        return res.status(500).send("Failed to delete message!");
      }
    }
    res.status(200).send("Received!");
  } else {
    console.error("The channel does not exist!");
    return res.status(500).send("Failed to send message!");
  }
});

const http = require("http");
http.createServer(app).listen(7779, () => {
  console.log("Server running at http://localhost:7777/");
});

function deleteMessage() {
  const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  if (channel) {
    const fetchedMessage = channel.messages.cache.get(messageID);
    if (fetchedMessage) {
      fetchedMessage.delete().then(() => console.log("Message deleted."));
    } else {
      console.error("Message not found in cache.");
    }
  } else {
    console.error("The channel does not exist!");
  }
}
