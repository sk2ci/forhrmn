
const discord = require('discord.js');

module.exports = {
  name: 'guildCreate',

  async execute(guild, client) {
    const owner = await guild.fetchOwner()


    let inv = await guild.channels.cache.filter(w => w.type === "GUILD_TEXT").map(x => x)[0].createInvite({
      maxAge: 0,
      maxUses: 0
    }).catch(e => console.log(e))


    const welcomer = new discord.WebhookClient({
      url: process.env.webhook
    })

    welcomer.send({ embeds: [new discord.MessageEmbed().setTitle('Sunucuya eklendi').setColor('GREEN').setDescription(`• **ID ** \`${guild.id}\`\n• **Name** \`${guild.name}\`\n• **Members** \`${guild.memberCount}\`\n• **Owner** \`${owner.user.tag}\`\n• **Bot** \`${client.user.username}\`\n• **Server** [Invite](${inv.url})`)] })
  }
}