'use strict';

const { logger } = require('../utils/');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    logger.debug(
      `${interaction.user.tag} in #${interaction.channel.name} triggered an interaction.`
    );

    const client = interaction.client;

    // If interaction is a slash command
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  },
};