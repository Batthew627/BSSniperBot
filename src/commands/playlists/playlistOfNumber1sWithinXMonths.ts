import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, playlistOfNumber1sWithinXMonths } from 'bssniper';
import fs from 'fs';
import { windowsFileNamify } from '../..';
const meta = new SlashCommandBuilder()
    .setName('number-ones-within-months')
    .setDescription('Generate a playlist of maps you have the highest score on within a given amount of months')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('amount-of-months')
        .setDescription('How many months would you like it to check?')
        .setRequired(true),
    );

export default command(meta, async ({ interaction })=>{
    const ssid1 = interaction.options.getString('your-scoresaber-id')!;
    const months = interaction.options.getNumber('amount-of-months')!;

    // these are required options so should never be null

    const user1 = await getPlayerData(ssid1);

    await interaction.reply({
        content: 'Generating your playlist...',
    });

    void writePlaylist(await playlistOfNumber1sWithinXMonths(user1, months));
    const name = windowsFileNamify((await playlistOfNumber1sWithinXMonths(user1, months)).playlistTitle).concat('.json');
    const path = `./playlists/${name}`;
    await interaction.editReply({
        content: 'Here is your playlist',
        files: [{
            attachment: path,
            name: name,
        }],
    });
    fs.unlink(path, err => {
        if (err) throw err;
        console.log(`${name} was deleted`);
    });
});
