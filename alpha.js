const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildEmojisAndStickers,GatewayIntentBits.GuildIntegrations,GatewayIntentBits.GuildWebhooks,GatewayIntentBits.GuildInvites,GatewayIntentBits.GuildVoiceStates,GatewayIntentBits.GuildPresences,GatewayIntentBits.GuildMessages,GatewayIntentBits.GuildMessageReactions,GatewayIntentBits.GuildMessageTyping,GatewayIntentBits.DirectMessages,GatewayIntentBits.DirectMessageReactions,GatewayIntentBits.DirectMessageTyping,GatewayIntentBits.MessageContent],shards: "auto", partials: [Partials.Message,Partials.Channel,Partials.GuildMember,Partials.Reaction,Partials.GuildScheduledEvent,Partials.User,Partials.ThreadMember]});

const config = require("./src/config.json");
const { readdirSync } = require("fs");
const data = require("mongoose");
const moment = require("moment");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");

const { token, mongoDB } = config;

data.connect(mongoDB)
  .then(() => console.log("MongoDataBase Connection Successful."))
  .catch(err => console.log("MongoDataBase Connection Failed: " + err));

client.commands = new Collection();
client.slashcommands = new Collection();
client.commandaliases = new Collection();

const rest = new REST({ version: '10' }).setToken(token);

const log = x => {
  console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${x}`);
};

// Command handler
const commands = [];
readdirSync('./src/commands/normal').forEach(async file => {
  const command = await require(`./src/commands/normal/${file}`);
  if (command) {
    client.commands.set(command.name, command);
    commands.push(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias => {
        client.commandaliases.set(alias, command.name);
      });
    }
  }
});

// Slash command handler
const slashcommands = [];
readdirSync('./src/commands/slash').forEach(async file => {
  const command = await require(`./src/commands/slash/${file}`);
  slashcommands.push(command.data.toJSON());
  client.slashcommands.set(command.data.name, command);
});

client.on("ready", async () => {
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashcommands }
    );
  } catch (error) {
    console.error(error);
  }
  log(`${client.user.username} Online!`);
});

// Event handler
readdirSync('./src/events').forEach(async file => {
  const event = await require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

// Node.js process events
process.on("unhandledRejection", e => {
  console.log(e);
});
process.on("uncaughtException", e => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", e => {
  console.log(e);
});

client.login(config.token);
