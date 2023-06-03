const { Client, CommandInteraction, REST, Routes} = require("discord.js");
const { readdir } = require('fs')
const { token } = require("../config.json")
/**
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {

    const rest = new REST({ version: "10" }).setToken(token);
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
    } catch (error) {
      return console.error(error);
    }
  
  client.user.setPresence({status: "dnd", activities: { name: "Developer by Alpha", type: "WATCHING"}})
  


};