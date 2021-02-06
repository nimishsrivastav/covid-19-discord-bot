require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

const axios = require('axios');
const countries = require("../countries.json");

const url = 'https://api.covid19api.com/total/country/';
const WHO_URL = 'https://www.who.int/emergencies/diseases/novel-coronavirus-2019';
const COUNTRIES_JSON = 'https://api.covid19api.com/countries';
const PREFIX = '$covid';
const HELP = '$covid_help';

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#c20000')
	.setDescription(`Hi! Thanks for adding this bot to your server!
  As we all are battling this horrid disease, we must take care of ourselves and the ones near us.
  For more details on COVID-19 and precautions to be taken, please visit ${WHO_URL}.
  Stay Safe! 😷
  
  Now, how to use this bot?
  This bot provides you information about the cases in the countries around the world, i.e., Confirmed Cases, Active Cases, Recoveries, Deaths.
  Just type '$covid' followed by country name as provided ('Slug' field) at ${COUNTRIES_JSON}.
  `)
	.setTimestamp();

client.on('ready', () => {
  console.log(`${client.user.username} COVID bot has entered the server!`);
});

client.on('message', async (msg) => {
  const content = msg.content.toLowerCase();

  if (content === HELP) {
    msg.channel.send(exampleEmbed);
  }
})

client.on('message', async (msg) => {
  const content = msg.content.toLowerCase().split(/\s+/);

  if (content[0] === PREFIX) {
    try {
      if (content.length > 2) {
        msg.reply('Too many arguments!');
        msg.reply(exampleEmbed);
      } else if (content.length === 1) {
        msg.reply('Not enough arguments!');
        msg.reply(exampleEmbed);
      } else if (!countries[content[1]]) {
        msg.reply('Wrong country format!');
        msg.reply(exampleEmbed);
      } else {
        const slug = content[1];
        const payload = await axios.get(`${url}${slug}`);
        const covidData = payload.data.pop();
  
        msg.reply(` below are the details:\nCountry: ${content[1].toUpperCase()}\nConfirmed: ${covidData.Confirmed}\nActive: ${covidData.Active}\nRecovered: ${covidData.Recovered}\nDeaths: ${covidData.Deaths}`);
        msg.reply(exampleEmbed);
      }
    } catch (err) {
      msg.reply(`Data not available for select country. Please try again!`);
      msg.reply(exampleEmbed);
    }
  }
}); 

client.login(process.env.DISCORDJS_BOT_TOKEN);