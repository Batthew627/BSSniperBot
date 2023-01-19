
import { config } from 'dotenv';
import { resolve } from 'path';
import express from 'express';
import ScoreSaberAPI from 'scoresaber.js';
import { rankedPlaylistByStarValue, writePlaylist } from 'bssniper';

config({ path: resolve(__dirname, '..', '.env') });
import './client';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.use('/static', express.static('static'));

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
        await writePlaylist(await rankedPlaylistByStarValue(0, 100, 'http://batthew.co.uk/static/ranked.json'), './static', 'ranked.json');
    }
}, 60000);

