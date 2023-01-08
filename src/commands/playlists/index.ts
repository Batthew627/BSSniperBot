import { category } from '../../utils';
import generateRankedPlaylist from './generateRankedPlaylist';
import playlistBelowAccuracy from './playlistBelowAccuracy';
import playlistByCombo from './playlistByCombo';
import playlistOfNumber1s from './playlistOfNumber1s';
import playlistOfNumber1sWithinXMonths from './playlistOfNumber1sWithinXMonths';
import playlistOfTopX from './playlistOfTopX';
import rankingQueuePlaylist from './rankingQueuePlaylist';
import snipePlaylist from './snipePlaylist';
import rankedPlaylistByStarValue from './rankedPlaylistByStarValue';
import playlistOfNotTopX from './playlistOfNotTopX';
import playlistByPercivedWorstScore from './playlistByPercivedWorstScore';

export default category('Playlists',
    [playlistBelowAccuracy,
        generateRankedPlaylist,
        playlistByCombo,
        playlistOfNumber1s,
        playlistOfNumber1sWithinXMonths,
        playlistOfTopX,
        rankingQueuePlaylist,
        snipePlaylist,
        rankedPlaylistByStarValue,
        playlistOfNotTopX,
        playlistByPercivedWorstScore,
    ]);
