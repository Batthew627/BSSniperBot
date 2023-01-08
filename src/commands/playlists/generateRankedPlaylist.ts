import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { rankedPlaylistByStarValue, writePlaylist } from 'bssniper';
import fs from 'fs';

const meta = new SlashCommandBuilder()
    .setName('regenerate-ranked-playlist')
    .setDescription('This will regenerate the ranked maps playlist');

export default command(meta, async ({ interaction })=>{
    await interaction.reply({
        content: 'Regenerating Ranked playlist',
    });

    void writePlaylist(await(rankedPlaylistByStarValue(0, 100, 'batthew.co.uk/playlists/ranked.json')), 'ranked');
    fs.rename('./ranked.json', './playlists/ranked.json', err => {
        if (err) throw err;
        void interaction.editReply({
            content: 'Ranked playlist has been regenerated',

        });
    });
});
