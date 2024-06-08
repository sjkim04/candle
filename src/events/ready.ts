import { ActivityType, ChatInputCommandInteraction, Events, Team, User } from 'discord.js';
import { Jejudo, SummaryCommand, EvaluateCommand, ShellCommand, DocsCommand } from 'jejudo';
import { guildId } from '../config.json';
import { createNoPermsMessage } from '../utils/message';
import fs from 'fs';
import path from 'path';
import { UpdatedClient } from '..';

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client: UpdatedClient) {
        const debug = client.debug;

        let owners: string[] = [];
        const owner: User | Team = (await client.application?.fetch())?.owner;

        if (owner instanceof Team) {
            owners = owner.members.map((x) => x.id);
        } else if (owner instanceof User) {
            owners = [owner.id];
        }

        client.jejudo = new Jejudo(client, {
            owners,
            isOwner: (user) => owners.includes(user.id),
            prefix: `<@${client.user.id}> `,
            command: 'j',
            textCommand: ['dok', 'dokdo', 'jejudo'],
            registerDefaultCommands: false,
            noPermission: (i: ChatInputCommandInteraction) =>
                i.reply({ embeds: [createNoPermsMessage('Bot Owner')] }),
        });

        const editedEvalCommand = new EvaluateCommand(client.jejudo);
        editedEvalCommand.data.name = 'js';
        const editedShCommand = new ShellCommand(client.jejudo);
        editedShCommand.data.name = 'sh';

        client.jejudo.registerCommand(new SummaryCommand(client.jejudo));
        client.jejudo.registerCommand(editedEvalCommand);
        client.jejudo.registerCommand(editedShCommand);
        client.jejudo.registerCommand(new DocsCommand(client.jejudo));

        const commands = [];
        const commandsPath = path.join(__dirname, '../commands');
        const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            commands.push(command.data.toJSON());
        }

        commands.push(client.jejudo.commandJSON);

        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);

            let data;
            // if (debug) {
            //     data = await client.application.commands.set(commands, guildId);
            // } else {
            //     data = await client.application.commands.set(commands);
            // }
            data = await client.application.commands.set(commands, guildId);

            console.log(`Successfully reloaded ${data.size} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }

        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
