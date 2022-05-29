'use strict';

const path = require('node:path');
const readdir = require('recursive-readdir-async');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { logger } = require('../utils/');
const { Collection } = require('discord.js');

module.exports = class CommandLoader {
  constructor(client, clientId, clientToken) {
    this.client = client;
    this.clientId = clientId;
    this.clientToken = clientToken;

    // Stores loaded commands to be deployed to Discord using deploy()
    this.commands = [];

    // TODO: Get these values dynamically
    this.guildId = '621481304101355531';
    this.commandsPath = path.join(__dirname, '..', 'commands');
  }

  // Reads commands located in the command directory and stores them in this.commands
  async readCommandFiles() {
    this.client.commands = new Collection();
    let commandFiles;

    // asynchronously get the .js files from "commands/" representing all the
    // available commands in our program
    try {
      const result = await readdir.list(this.commandsPath);
      commandFiles = result.filter((file) => file.name.endsWith('.js'));
    } catch (error) {
      logger.error(`Failed to load commands from '${this.commandsPath}'`);
      throw error;
    }

    // store the commands using the name as keys and the command obj as values
    for (const file of commandFiles) {
      const filePath = path.join(this.commandsPath, file.name);
      const command = require(filePath);
      // Adds command to commands property of client
      this.client.commands.set(command.data.name, command);
      // Adds command to commands property of CommandLoader
      this.commands.push(command.data.toJSON());
      logger.debug(`Loaded command: ${command.data.name}`);
    }

    this.deployToGuild();
  }

  // Push loaded commands to Discord
  // TODO: Separate function for global commands
  async deployToGuild() {
    const rest = new REST({ version: '9' }).setToken(this.clientToken);
    logger.debug('Registering commands to guild: ' + this.guildId);

    rest
      .put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
        body: this.commands,
      })
      .then(() => logger.info('Successfully registered application commands.'))
      .catch(logger.error);
  }
};
