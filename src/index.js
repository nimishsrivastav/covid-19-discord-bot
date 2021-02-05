require('dotenv').config();

const { Client, Message } = require('discord.js');
const client = new Client();

const axios = require('axios');

const countries = require("../countries.json");
const url = 'https://api.covid19api.com/total/country/';
const WHO_URL = 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019';
const PREFIX = '$covid';
const HELP = '$covid_help';
const COUNTRIES_JSON = 'https://api.covid19api.com/countries';

client.on('ready', () => {
  console.log(`${client.user.username} COVID bot has entered the server!`);
});

client.on('message', async (msg) => {
  const content = msg.content.toLowerCase();

  if (content === HELP) {
    msg.channel.send(`Hi! Thanks for adding this bot to your server!\nAs we all are battling this horrid disease, we must take care of ourselves and the ones near us.\nFor more details on COVID-19 and precautions to be taken, please visit ${WHO_URL}.\nStay Safe! 😷`);

    setTimeout(() => {
      msg.channel.send(`Now, how to use this bot?\nThis bot give you information about the cases in the countries around the world, i.e., Confirmed Cases, Active Cases, Recoveries, Deaths. Just type '$covid' followed by country name as provided ('Slug' field) at ${COUNTRIES_JSON}`);
    }, 3000);
  }
})

client.on('message', async (msg) => {
  const content = msg.content.toLowerCase().split(/\s+/);

  if (content[0] === PREFIX) {
    if (content.length > 2) {
      msg.reply('Too many arguments!');
    } else if (content.length === 1) {
      msg.reply('Not enough arguments!');
    } else if (!countries[content[1]]) {
      msg.reply('Wrong country format!');
    } else {
      const slug = content[1];
      const payload = await axios.get(`${url}${slug}`);
      const covidData = payload.data.pop();

      msg.reply(` below are the details:\nCountry: ${content[1].toUpperCase()}\nConfirmed: ${covidData.Confirmed}\nActive: ${covidData.Active}\nRecovered: ${covidData.Recovered}\nDeaths: ${covidData.Deaths}`);
    }
  }
}); 

client.login(process.env.DISCORDJS_BOT_TOKEN);