const Discord = require("discord.js");
const dotenv = require("dotenv");
const handler = require("./handler.js");

dotenv.config({ path: "./config.env" });
const client = new Discord.Client();

client.on("message", async (msg) => {
  if (msg.content.startsWith("!rehelp")) {
    msg.channel.send("```!re get [handles] from [handles] rating 1500```");
  } else if (msg.content.startsWith("!re")) {
    const args = msg.content.split(" ");
    let getHandles = [];
    let fromHandles = [];
    let rating = 0;
    var f = 0;
    for (arg of args) {
      if (arg === "get") {
        f = 1;
        continue;
      }
      if (arg === "from") {
        f = 2;
        continue;
      }
      if (arg === "rating") {
        f = 3;
        continue;
      }
      if (f === 1) getHandles.push(arg);
      if (f === 2) fromHandles.push(arg);
      if (f === 3) rating = arg;
    }
    if (getHandles.length == 0) {
      msg.channel.send(`${msg.author} please enter 'get' handles.`);
    } else if (fromHandles.length == 0) {
      msg.channel.send(`${msg.author} please enter 'from' handles.`);
    } else await handler.getProblems(getHandles, fromHandles, rating, msg);
  }
});

client.on("ready", () => {
  console.log("Bot is connected!");
});

client.login(process.env.REBOT_TOKEN);
