import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
const meta = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping the bot for a response')
    .addStringOption(option => option
        .setName('message')
        .setDescription('provide a message')
        .setRequired(false),
    );

export default command(meta, ({ interaction })=>{
    const message = interaction.options.getString('message');
    return interaction.reply({
        ephemeral: true,
        content: message ?? 'pong',
    });
});
