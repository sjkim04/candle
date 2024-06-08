import { SlashCommandBuilder } from 'discord.js';
import { UpdatedInteraction } from '..';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: UpdatedInteraction) {
        const sent_locales = {
            en: 'Pinging...',
            ko: '핑하는 중입니다...',
        };
        const received_locales = {
            en: 'Pong! Latency: ',
            ko: '퐁! 핑 수치: ',
        };
        const sent = await interaction.reply({
            content: sent_locales[interaction.locale] ?? sent_locales['en'],
            fetchReply: true,
            ephemeral: true,
        });
        interaction.editReply(
            `${received_locales[interaction.locale] ?? received_locales['en']}${
                sent.createdTimestamp - interaction.createdTimestamp
            }ms`,
        );
    },
};
