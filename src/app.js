'use strict';

const Discord = require('discord.js');
// Used for handling environment variables for api keys
const dotenv = require('dotenv');
// Load environment variables
const dotenvError = dotenv.config().error;
if (dotenvError) {
  throw dotenvError;
}
