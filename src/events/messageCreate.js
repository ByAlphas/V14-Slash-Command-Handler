const config = require("../config.json");
const { Collection } = require("discord.js");
const ms = require("ms");
const cooldown = new Collection();

module.exports = {
  name: 'messageCreate',
  execute: async (message) => {
    const client = message.client;
    if (message.author.bot || message.channel.type === 'dm') return;

    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (!cmd.length) return;

    let command = client.commands.get(cmd) || client.commands.get(client.commandaliases.get(cmd));
    if (!command) return;

    const cooldownKey = `${command.name}_${message.author.id}`;
    const now = Date.now();
    const expirationTime = cooldown.get(cooldownKey);

    if (command.cooldown && expirationTime && now < expirationTime) {
      const timeLeft = expirationTime - now;

      return message.reply({
        content: `Cooldown is active. Please try again in \`${ms(timeLeft, { long: true })}\`.`
      }).then(msg => {
        setTimeout(() => msg.delete().catch(() => {}), 2300); // Delete warning after 2 second, 300 millisecond
      });
    }

    // Run command
    command.run(client, message, args);

    // Apply cooldown
    if (command.cooldown) {
      cooldown.set(cooldownKey, now + command.cooldown);
      setTimeout(() => cooldown.delete(cooldownKey), command.cooldown);
    }
  }
};
