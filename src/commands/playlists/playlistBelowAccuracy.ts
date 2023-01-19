import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { playlistOfScoresBelowGivenAccuracy, getPlayerData, writePlaylist } from 'bssniper';
import fs from 'fs';
import { windowsFileNamify } from '../..';
const meta = new SlashCommandBuilder()
    .setName('playlist-below-accuracy')
    .setDescription('Generate a playlist of songs you have under a given accuracy')
    .addStringOption(option => option
        .setName('scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('target-accuracy')
        .setDescription('Please provide the target accuracy')
        .setRequired(true),
    )
    .addBooleanOption(option => option
        .setName('ranked-only')
        .setDescription('Would you like the playlist to be ranked only?')
        .setRequired(true),
    );

export default command(meta, async ({ interaction })=>{
    const ssid = interaction.options.getString('scoresaber-id')!;
    const acc = interaction.options.getNumber('target-accuracy')!;
    const ranked = interaction.options.getBoolean('ranked-only')!;
    // these are required options so should never be null

    await interaction.reply({
        content: 'Generating your playlist...',
    });
    const user = getPlayerData(ssid);
    void writePlaylist(await playlistOfScoresBelowGivenAccuracy(await(user), acc, ranked));

    const name = windowsFileNamify((await playlistOfScoresBelowGivenAccuracy(await(user), acc, ranked)).playlistTitle).concat('.json');
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
