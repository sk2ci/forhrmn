module.exports = {
  name: 'ready',
  once: true,

  /**
   * @param {Client} client 
   */
  async execute(client) {

let ayarlar = require("../../kaladin")
    
client.user.setPresence({ activities: [{ name: ayarlar.durum, type: ayarlar.type || "PLAYING"}], status: ayarlar.status || "dnd"})

   console.log(`[LOG] ${client.user.tag} is now online!\n[LOG] Bot serving on Ready to serve in ${client.guilds.cache.size} servers\n[LOG] Bot serving ${client.users.cache.size} users`);
  }
}