
import { config } from 'dotenv';
import fs from 'fs';
import path, { resolve } from 'path';
import express from 'express';
import ScoreSaberAPI from 'scoresaber.js';
import { getPlayerData, rankedPlaylistByStarValue, snipePlaylist, writePlaylist } from 'bssniper';

const serverUrl = 'http://localhost:3000';


config({ path: resolve(__dirname, '..', '.env') });
import './client';

const app = express();
const port = 8080;


app.get('/', (req, res) => {
    res.send('Hello World!');
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

export function windowsFileNamify(file:string) {
    return file.replace(/[\/\\:*?"<>|]/g, '_');
}

let currentMostRankedDate:Date;
// eslint-disable-next-line @typescript-eslint/no-misused-promises
setInterval(async ()=>{
    const latestRankedDate = (await ScoreSaberAPI.fetchLatestRankedMaps()).leaderboards[0].rankedDate;
    if (latestRankedDate !== currentMostRankedDate) {
        currentMostRankedDate = latestRankedDate;
        console.log('hi');
        await writePlaylist(await rankedPlaylistByStarValue(0, 100, 'http://batthew.co.uk:8080/static/ranked.json'), './static', 'ranked');
    }
}, 60000);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
setInterval(async () =>{
    const aug = (await getPlayerData('76561199073044136'));
    const totalAugScores = aug.playerScores.length;
    const bat = (await getPlayerData('76561198121538359'));
    const snipe = (await snipePlaylist(aug, bat, false)).songs.length;
    console.log(`${snipe} / ${totalAugScores}`);
}, 6000);

