import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, playlistByPercievedWorstScore } from 'bssniper';
import fs from 'fs';
import { windowsFileNamify } from '../..';
const meta = new SlashCommandBuilder()
    .setName('playlist-of-percived-worst-score')
    .setDescription('Generate a playlist that orders based on percieved potential improvement')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('lowest-star')
        .setDescription('lowest star value')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('highest-star')
        .setDescription('highest star value')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('below-rank')
        .setDescription('below rank')
        .setRequired(true),
    );


export default command(meta, async ({ interaction })=>{
    const ssid = interaction.options.getString('your-scoresaber-id')!;
    const minStar = interaction.options.getNumber('lowest-star')!;
    const maxStar = interaction.options.getNumber('highest-star')!;
    const belowRank = interaction.options.getNumber('below-rank')!;


    // these are required options so should never be null

    const user1 = await getPlayerData(ssid);

    await interaction.reply({
        content: 'Generating your playlist...',
    });

    void writePlaylist(await playlistByPercievedWorstScore(user1, minStar, maxStar, belowRank));
    const name = windowsFileNamify((await playlistByPercievedWorstScore(user1, minStar, maxStar, belowRank)).playlistTitle).concat('.json');
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
