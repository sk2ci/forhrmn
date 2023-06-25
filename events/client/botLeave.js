
const discord = require('discord.js');

module.exports = {
  name: 'guildDelete',

  async execute(guild, client) {

    const welcomer = new discord.WebhookClient({
      url: process.env.webhook
    })

    welcomer.send({ embeds: [new discord.MessageEmbed().setTitle('Sunucudan ayrıldı').setColor('RED').setDescription(`• **ID
** \`${guild.id}\`\n• **Name** \`${guild.name}\`\n• **Bot** \`${client.user.username}\``)]})
  }
}