import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { getPlayerData, writePlaylist, playlistByCombo } from 'bssniper';
import fs from 'fs';
const meta = new SlashCommandBuilder()
    .setName('playlist-by-combo')
    .setDescription('Generate a playlist of maps you have either got a full combo on or dont have a full combo on')
    .addStringOption(option => option
        .setName('your-scoresaber-id')
        .setDescription('Please Provide Your Scoresaber ID')
        .setRequired(true),
    )
    .addBooleanOption(option => option
        .setName('full-combo')
        .setDescription('true = maps you do have a full combo on, false= maps you dont.')
        .setRequired(true),
    )
    .addBooleanOption(option => option
        .setName('only-ranked')
        .setDescription('true = only ranked maps, false = unranked maps aswell.')
        .setRequired(true),
    );


export default command(meta, async ({ interaction })=>{
    const ssid = interaction.options.getString('your-scoresaber-id')!;
    const fullCombo = interaction.options.getBoolean('full-combo?')!;
    const ranked = interaction.options.getBoolean('only-ranked?')!;

    // these are required options so should never be null

    const user1 = await getPlayerData(ssid);

    void writePlaylist(await playlistByCombo(user1, fullCombo, ranked));
    const name = (await playlistByCombo(user1, fullCombo, ranked)).playlistTitle.concat('.json');
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
