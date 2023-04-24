/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { config } from 'dotenv';
import fs from 'fs';
import path, { resolve } from 'path';
import express from 'express';
import ScoreSaberAPI from 'scoresaber.js';
import { getPlayerData, rankedPlaylistByStarValue, snipePlaylist, writePlaylist } from 'bssniper';
import util from 'util';

const app = express();
const port = 8080;

// Converts an image at a given file path to a base64 string.
async function imgToBase64(imagePath: string): Promise<string> {
    let ext = path.extname(imagePath).substr(1);
    if (ext === 'svg') ext = 'svg+xml';
    const readFile = util.promisify(fs.readFile);
    const imgData = await readFile(imagePath);
    return `data:image/${ext}$;base64,${imgData.toString('base64')}`;
}

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
    batPlaylist.image= await imgToBase64('./static/auguxt.png');
    augPlaylist.image = await imgToBase64('./static/bat.png');
    batPlaylist.syncURL=`http://batthew.co.uk:8080/static/batthew.json`;
    augPlaylist.syncURL=`http://batthew.co.uk:8080/static/august.json`;
    await writePlaylist(batPlaylist, './static', 'batthew');
    await writePlaylist(augPlaylist, './static', 'august');
    console.log('boo');
}, 60000);


