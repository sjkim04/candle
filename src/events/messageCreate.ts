import { Events } from 'discord.js';
import { UpdatedMessage } from '..';

module.exports = {
    name: Events.MessageCreate,
    async execute(message: UpdatedMessage) {
        if (message.author.bot) return;

        message.client.jejudo.handleMessage(message);
    },
};
