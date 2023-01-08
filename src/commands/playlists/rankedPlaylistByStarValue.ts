import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { rankedPlaylistByStarValue, writePlaylist } from 'bssniper';
import fs from 'fs';

const meta = new SlashCommandBuilder()
    .setName('ranked-playlist-by-star-value')
    .setDescription('This will generate a playlist of ranked maps within a star range')
    .addNumberOption(option => option
        .setName('min-star')
        .setDescription('Lowest star value')
        .setRequired(true),
    )
    .addNumberOption(option => option
        .setName('max-star')
        .setDescription('highest star value')
        .setRequired(true),
    );

export default command(meta, async ({ interaction })=>{
    await interaction.reply({
        content: 'Generating your playlist...',
    });

    const minStar = interaction.options.getNumber('min-star')!;
    const maxStar = interaction.options.getNumber('max-star')!;

    void writePlaylist(await(rankedPlaylistByStarValue(minStar, maxStar)));
    const name = (await (rankedPlaylistByStarValue(minStar, maxStar))).playlistTitle.concat('.json');
    await interaction.reply({
        content: 'Here is your playlist',
        files: [{
            attachment: name,
            name: name,
        }],
    });
    fs.unlink(name, err => {
        if (err) throw err;
        console.log(`${name} was deleted`);
    });
});
