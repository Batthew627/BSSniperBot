import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, playlistOfNumber1s } from 'bssniper';
import fs from 'fs';
const meta = new SlashCommandBuilder()
    .setName('playlist-of-number1s')
    .setDescription('Generate a playlist of maps you have the highest score on')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    );
export default command(meta, async ({ interaction })=>{
    const ssid1 = interaction.options.getString('your-scoresaber-id')!;
    // these are required options so should never be null

    const user1 = await getPlayerData(ssid1);

    void writePlaylist(await playlistOfNumber1s(user1));
    const name = (await playlistOfNumber1s(user1)).playlistTitle.concat('.json');
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
