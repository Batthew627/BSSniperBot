import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, playlistOfTopX } from 'bssniper';
import fs from 'fs';
const meta = new SlashCommandBuilder()
    .setName('playlist-of-top-x')
    .setDescription('Generate a playlist you are top X in (i.e top 50)')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('x')
        .setDescription('eg. 50 means maps you are in the top 50 scores')
        .setRequired(true),
    )
    .addBooleanOption(option => option
        .setName('only-ranked')
        .setDescription('true = only ranked maps, false = unranked maps aswell.')
        .setRequired(true),
    );


export default command(meta, async ({ interaction })=>{
    const ssid = interaction.options.getString('your-scoresaber-id')!;
    const x = interaction.options.getNumber('x')!;
    const ranked = interaction.options.getBoolean('only-ranked?')!;

    // these are required options so should never be null

    const user1 = await getPlayerData(ssid);

    void writePlaylist(await playlistOfTopX(user1, x, ranked));
    const name = (await playlistOfTopX(user1, x, ranked)).playlistTitle.concat('.json');
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
