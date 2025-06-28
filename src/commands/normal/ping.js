const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ping = require("../slash/ping");

module.exports = {
    name: "ping",
    aliases: ["pong"],
    cooldown: 5000, //1 Second : 1000ms
    run: async (client, message, args) => {
      message.reply(`Pong 🏓 : \`${client.ws.ping}\` ms`)
    }
 };