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

app.get('/batthew', async (_req, res) => {
    const temp = await snipedata('76561199073044136', '76561198121538359');
    res.send(temp);
});

app.get('/august', async (_req, res) => {
    const temp = await snipedata('76561198121538359', '76561199073044136');
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
        await writePlaylist(await rankedPlaylistByStarValue(0, 100, 'http://player2.co.uk:8080/static/ranked.json'), './static', 'ranked');
    }
}, 60000);

async function snipedata(ssid1: string, ssid2: string) {
    const player1 = (await getPlayerData(ssid1));
    const player2 = (await getPlayerData(ssid2));
    const player2Snipe = (await snipePlaylist(player1, player2, false)).songs.length;
    const player1Snipe = (await snipePlaylist(player2, player1, false)).songs.length;
    const totalScores = player2Snipe + player1Snipe;
    return `${player2Snipe} / ${totalScores}`;
}
