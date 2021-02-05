require('dotenv').config();

const { Client } = require('discord.js');
const client = new Client();

const axios = require('axios');

const countries = require("../countries.json");
const url = 'https://api.covid19api.com/total/country/';
const PREFIX = '$covid';

client.on('ready', () => {
  console.log(`${client.user.username} COVID bot has entered the server!`);
});

client.on('message', async (msg) => {
  const content = msg.content.toLowerCase().split(/\s+/);

  if (content[0] === PREFIX) {
    if (content.length > 2){
      msg.reply('Too many arguments!');
    } else if (content.length === 1) {
      msg.reply('Not enough arguments!');
    } else if (!countries[content[1]]) {
      msg.reply('Wrong country format!');
    } else {
      const slug = content[1];
      const payload = await axios.get(`${url}${slug}`);
      const covidData = payload.data.pop();

      msg.reply(` below are the details:\nCountry: ${content[1].toUpperCase()}\nConfirmed: ${covidData.Confirmed}\nDeaths: ${covidData.Deaths}\nRecovered: ${covidData.Recovered}\nActive: ${covidData.Active}`);
    }
  }
}); 

client.login(process.env.DISCORDJS_BOT_TOKEN);