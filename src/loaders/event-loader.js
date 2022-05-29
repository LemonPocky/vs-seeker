'use strict';

const path = require('node:path');
const readdir = require('recursive-readdir-async');
const { logger } = require('../utils/');

/*
 * Class for loading client events located in the events directory.
 */
module.exports = class EventLoader {
  constructor(client) {
    this.client = client;
    this.eventsPath = path.join(__dirname, '..', 'events');
  }

  // Reads events located in the event directory and stores them in this.commands
  async readEventFiles() {
    let eventFiles;

    // asynchronously get the .js files from "commands/" representing all the
    // available commands in our program
    try {
      const result = await readdir.list(this.eventsPath);
      eventFiles = result.filter((file) => file.name.endsWith('.js'));
    } catch (error) {
      logger.error(`Failed to load events from '${this.eventsPath}'`);
      throw error;
    }

    // Set up event handlers for client using the found events
    for (const file of eventFiles) {
      const filePath = path.join(this.eventsPath, file.name);
      const event = require(filePath);
      // Events handled only once should set once to true
      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }
      logger.debug(`Loaded event: ${event.name}`);
    }
  }
};
