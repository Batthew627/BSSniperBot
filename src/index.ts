import { config } from 'dotenv';
import { resolve } from 'path';
import express from 'express';

config({ path: resolve(__dirname, '..', '.env') });

const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => console.log(`Server listening on port: ${port}`));

app.use(express.static('resources'));

export function windowsFileNamify(file:string) {
    return file.replace(/[\/\\:*?"<>|]/g, '_');
}

import './client';
