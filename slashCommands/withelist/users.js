const discord = require('discord.js')
const users = require('../../models/users');

module.exports = {
  name: "users",
  description: "total users",
  default_permission: true,
  timeout: 3000,
  category: "whitelist",
  userPerms: ["SEND_MESSAGES"],
  ownerOnly: false,

  run: async (client, interaction, args) => {

    const data = await users.find()
    const datatr = await users.find({ country_code: "TR" })
    interaction.reply({
      embeds: [new discord.MessageEmbed().setColor('RED').setDescription(`Total Users Count : \`${data.length}\`
  
  `)]
    })
    //:flag_tr: \`${datatr.length}\`
  }
}