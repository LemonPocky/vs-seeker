'use strict';

const pino = require('pino');
const { loggingLevel } = require('../config.json');

// Instantiate logger
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      levelFirst: true,
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

// Configure additional logger settings
logger.level = loggingLevel;
logger.info('Pino logger initialized.');

// module returns a singleton logger used across the entire program
module.exports = logger;
