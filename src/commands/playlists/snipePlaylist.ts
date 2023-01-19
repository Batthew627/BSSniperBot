import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, snipePlaylist } from 'bssniper';
import fs from 'fs';
const meta = new SlashCommandBuilder()
    .setName('snipe-playlist')
    .setDescription('Generate a playlist of songs you have a worse score on than the other user')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addStringOption(option => option
        .setName('opponent-scoresaber-id')
        .setDescription('Please provide the scoresaber ID of your opponent')
        .setRequired(true),
    )
    .addBooleanOption(option => option
        .setName('ranked-only')
        .setDescription('Would you like the playlist to be ranked only?')
        .setRequired(true),
    );

export default command(meta, async ({ interaction })=>{
    const ssid1 = interaction.options.getString('your-scoresaber-id')!;
    const ssid2 = interaction.options.getString('opponent-scoresaber-id')!;
    const ranked = interaction.options.getBoolean('ranked-only')!;
    // these are required options so should never be null

    const user1 = await getPlayerData(ssid1);
    const user2 = await getPlayerData(ssid2);

    void writePlaylist(await snipePlaylist(user1, user2, ranked));
    const name = (await snipePlaylist(user1, user2, ranked)).playlistTitle.concat('.json');
    const path = `./playlists/${name}`;
    await interaction.reply({
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
