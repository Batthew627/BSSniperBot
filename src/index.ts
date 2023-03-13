/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { config } from 'dotenv';
import fs from 'fs';
import path, { resolve } from 'path';
import express from 'express';
import ScoreSaberAPI from 'scoresaber.js';
import { getPlayerData, rankedPlaylistByStarValue, snipePlaylist, writePlaylist } from 'bssniper';
import cors from 'cors';

config({ path: resolve(__dirname, '..', '.env') });
import './client';


const app = express();
const port = 8080;
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/index', async (_req, res) => {
    const temp = await snipedata();
    res.send(temp);
});


app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.use('/static', express.static('static'));

app.post('/update-html', (req, res) => {
    const htmlFilePath = path.join(__dirname, 'public', 'index.html');
    const newHtmlContent = ' ';

    fs.writeFile(htmlFilePath, newHtmlContent, (err: any) => {
        if (err) {
            console.error(err);
            res.status(500).send('Failed to update HTML content');
        } else {
            res.send('HTML content updated successfully');
        }
    });
});

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
        await writePlaylist(await rankedPlaylistByStarValue(0, 100, 'http://batthew.co.uk:8080/static/ranked.json'), './static', 'ranked');
    }
}, 60000);

async function snipedata() {
    const august = (await getPlayerData('76561199073044136'));
    const batthew = (await getPlayerData('76561198121538359'));
    const batSnipe = (await snipePlaylist(august, batthew, false)).songs.length;
    const augSnipe = (await snipePlaylist(batthew, august, false)).songs.length;
    const totalScores = batSnipe + augSnipe;
    return `${batSnipe} / ${totalScores}`;
}
