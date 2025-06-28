const { Client, CommandInteraction, REST, Routes} = require("discord.js");
const { readdir } = require('fs')
const { token, activity, stats } = require("../config.json")
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
  
    //dnd, offline, online, idle
  client.user.setPresence({status: stats, activities: { name: activity, type: "WATCHING"}})
  


};