/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { config } from 'dotenv';
import fs from 'fs';
import path, { resolve } from 'path';
import express from 'express';
import ScoreSaberAPI from 'scoresaber.js';
import { getPlayerData, rankedPlaylistByStarValue, snipePlaylist, writePlaylist } from 'bssniper';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.use('/static', express.static('static'));

config({ path: resolve(__dirname, '..', '.env') });
import './client';

export function windowsFileNamify(file: string) {
    return file.replace(/[\/\\:*?"<>|]/g, '_');
}

let currentMostRankedDate: Date;
setInterval(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const latestRankedDate = (await ScoreSaberAPI.fetchLatestRankedMaps()).leaderboards[0].rankedDate;
    if (latestRankedDate !== currentMostRankedDate) {
        currentMostRankedDate = latestRankedDate;
        console.log('hi');
        await writePlaylist(await rankedPlaylistByStarValue(0, 100, 'http://player2.co.uk:8080/static/ranked.json'), './static', 'ranked');
    }
}, 60000);

setInterval(async () =>{
    const bat = await getPlayerData('76561198121538359');
    const aug = await getPlayerData('76561199073044136');
    const batPlaylist = await snipePlaylist(bat, aug, false);
    const augPlaylist = await snipePlaylist(aug, bat, false);
    batPlaylist.syncURL=`http://batthew.co.uk:8080/static/${windowsFileNamify(batPlaylist.playlistTitle)}`;
    augPlaylist.syncURL=`http://batthew.co.uk:8080/static/${windowsFileNamify(augPlaylist.playlistTitle)}`;
    await writePlaylist(batPlaylist, './static');
    await writePlaylist(augPlaylist, './static');
}, 300000);


