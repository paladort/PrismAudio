const Discord = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const client = new Discord.Client();
const config = {
  token: process.env.TOKEN,
  prefix: process.env.PREFIX,
};
client.config = config;
client.queue = new Map();

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

fs.readdir('./commands', (err, files) => {
  if (err) throw err
  files.forEach(file => {
      if (!file.endsWith('.js')) return
      const command = require(`./commands/${file}`)
      client.commands.set(command.name, command)
  })
})

client.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    let props = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    console.log(`[Command Manager]: Loading Command ${commandName}`);
    client.commands.set(commandName, props);
  });
});


client.on('ready', () => {
  const statuses = [
      () => `${client.guilds.cache.size} serveurs`,
      () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} utilisateurs`,
      () => `-help`,
      () => `Mon prefix est "-"`
  ]
  let i = 0
  setInterval(() => {
      client.user.setActivity(statuses[i](), {type: 'LISTENING'})
      i = ++i % statuses.length
  }, 1e4)
})

client.login(client.config.token);
