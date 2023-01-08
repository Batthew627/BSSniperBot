import { SlashCommandBuilder } from 'discord.js';
import { command } from '../../utils';
import { rankingQueuePlaylist, writePlaylist } from 'bssniper';
import fs from 'fs';
const meta = new SlashCommandBuilder()
    .setName('regenerate-ranking-queue-pl')
    .setDescription('This will regenerate the ranked maps playlist');

export default command(meta, async ({ interaction })=>{
    await interaction.reply({
        content: 'Regenerating Ranked playlist',
    });

    const playlist = await rankingQueuePlaylist();
    playlist.syncURL='batthew.co.uk/playlists/rankingQueue.json';

    void writePlaylist(playlist, 'rankingQueue.json');
    fs.rename('./rankingQueue.json', './playlists/rankingQueue.json', err => {
        if (err) throw err;
        void interaction.editReply({
            content: 'Ranked playlist has been regenerated',

        });
    });
});
