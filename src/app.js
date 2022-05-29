'use strict';

// Used for handling environment variables for api keys
const dotenv = require('dotenv');
// Load environment variables
const dotenvError = dotenv.config().error;
if (dotenvError) {
  throw dotenvError;
}

const Discord = require('discord.js');
const { logger } = require('./utils/');
const { CommandLoader } = require('./loaders');
const EventLoader = require('./loaders/event-loader');

// Initialize Discord client
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });

// run once when bot is logged in to Discord
client.once('ready', () => {
  logger.info('Connected');
  logger.info(`Logged in as: ${client.user.username} - id:${client.user.id}`);
  logger.info('Ready to receive commands.');
});

// Set up events
const eventLoader = new EventLoader(client);
eventLoader.readEventFiles();

// Deploy guild commands
const commandLoader = new CommandLoader(
  client,
  process.env.DISCORD_CLIENT_ID,
  process.env.DISCORD_TOKEN
);
commandLoader.readCommandFiles().catch((error) => logger.error(error));

client.login(process.env.DISCORD_TOKEN);
