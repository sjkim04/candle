import {
    ComponentType,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ChatInputCommandInteraction,
} from 'discord.js';

export const disableComponents = (components, excl) => {
    const rows: ActionRowBuilder[] = [];
    if (!Array.isArray(excl)) excl = [excl];

    for (const oldRow of components) {
        const row = new ActionRowBuilder().addComponents(
            oldRow.components.map((component) => {
                if (excl.some((element) => component.data.custom_id.startsWith(element)))
                    return component;

                let disabledComp;
                switch (component.data.type) {
                    case ComponentType.Button:
                        disabledComp = ButtonBuilder.from(component);
                        break;
                    case ComponentType.StringSelect:
                        disabledComp = StringSelectMenuBuilder.from(component);
                        break;
                }

                disabledComp.setDisabled(true);
                return disabledComp;
            }),
        );

        rows.push(row);
    }

    return rows;
};

export const createNoPermsMessage = (permsName: string) => {
    const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('No Perms')
        .setDescription(
            `:x: You do not have the permissions to do that!\nYou need the ${permsName} permission.`,
        )
        .setTimestamp();
    return embed;
};

export const permsChecker = async (
    condition: Function,
    permsName: string,
    guildOnly: true,
    interaction: ChatInputCommandInteraction,
) => {
    if (guildOnly && !interaction.inGuild()) {
        interaction = interaction as ChatInputCommandInteraction;
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Server Only')
            .setDescription(
                `:x: You cannot run the </${interaction.commandName}:${interaction.commandId}> command in DMs!\nPlease try again in a server.`,
            )
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
        return false;
    }
    const results = await condition(interaction);

    if (!results && this) {
        const embed = createNoPermsMessage(permsName);

        await interaction.reply({ embeds: [embed] });
        return false;
    }

    return true;
};
