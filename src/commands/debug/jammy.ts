import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
const meta = new SlashCommandBuilder()
    .setName('jammy')
    .setDescription('proof that ts is better');


export default command(meta, ({ interaction }) => {
    // const message = interaction.options.getString('message');
    return interaction.reply({
        ephemeral: true,
        content: 'screw you jammy',
    });
});
