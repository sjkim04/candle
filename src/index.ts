import fs from 'node:fs';
import path from 'node:path';
import {
    Client,
    ChatInputCommandInteraction,
    GatewayIntentBits,
    Collection,
    Partials,
    ActivityType,
    Message,
    AutocompleteInteraction,
} from 'discord.js';
import { Jejudo } from 'jejudo';
import { token } from './config.json';

export interface UpdatedClient extends Client<true> {
    debug?: boolean;
    commands?: Collection<string, Object>;
    selectHandlers?: Collection<string, Object>;
    buttonHandlers?: Collection<string, Object>;
    jejudo?: Jejudo;
}

export interface UpdatedInteraction extends ChatInputCommandInteraction {
    client: UpdatedClient;
}

export interface UpdateAutocompleteInteraction extends AutocompleteInteraction {
    client: UpdatedClient;
}

export interface UpdatedMessage extends Message {
    client: UpdatedClient;
}

const client: UpdatedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
});

client.debug = process.argv[2] === '--debug';

function loadCommands() {
    client.commands = new Collection();

    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(
                `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
            );
        }
    }
}

function loadEvents() {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

function loadHandlers() {
    client.selectHandlers = new Collection();
    client.buttonHandlers = new Collection();

    const handlersPath = path.join(__dirname, 'handlers');
    const selectPath = path.join(handlersPath, 'selectMenu');
    const buttonPath = path.join(handlersPath, 'button');

    const selectFiles = fs.readdirSync(selectPath).filter((file) => file.endsWith('.js'));
    const buttonFiles = fs.readdirSync(buttonPath).filter((file) => file.endsWith('.js'));

    for (const file of selectFiles) {
        const filePath = path.join(selectPath, file);
        const handler = require(filePath);

        client.selectHandlers.set(file.split('.')[0], handler);
    }

    for (const file of buttonFiles) {
        const filePath = path.join(buttonPath, file);
        const handler = require(filePath);

        client.buttonHandlers.set(file.split('.')[0], handler);
    }
}

loadCommands();
loadEvents();
loadHandlers();

client.login(token);
