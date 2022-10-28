import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import path from 'path';
import { generateRandomString } from './utils';
import { getTopArtists, getTopTracks } from './api';

const app = express();
dotenv.config();

// VARIABLES
const PORT = 8888;

const client_id = process.env.client_id!;
const client_secret = process.env.client_secret!;
const redirect_uri = process.env.redirect_uri!;

const stateKey = 'spotify_auth_state';

// Your application requests authorization
const appAuthorization = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
];

app.use(cors()).use(cookieParser());

// Main point
app.use(express.static(path.join(__dirname, '/public'), { extensions: ['html'] }));


app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = appAuthorization.join(' ');

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
    });
    const URL = 'https://accounts.spotify.com/authorize?' + params.toString();

    res.redirect(URL);
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.status(400).send('state_mismatch');
    } else {
        res.clearCookie(stateKey);

        let data;
        if (code) {
            data = new URLSearchParams({
                code: code as string,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            });
        } else {
            data = new URLSearchParams({
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code',
            });
        }

        axios.post('https://accounts.spotify.com/api/token', data, {
            headers: {
                Authorization: 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
            },
        }).then((response) => {
            if (response.status === 200) {
                res.cookie('access_token', response.data.access_token);
                res.cookie('refresh_token', response.data.refresh_token);

                // we can also pass the token to the browser to make requests from there
                res.redirect('/logged');
            }
        }).catch(() => {
            res.status(400).send('invalid_token');
        });
    }
});

app.get('/tracks', async (req, res) => {
    try {
        const topTracks = await getTopTracks(req.cookies.access_token, 'short_term', 10);
        res.send(topTracks);
    } catch (error) {
        res.status(400).send('Missing access token');
    }
});

app.get('/artists', async (req, res) => {
    try {
        const topTracks = await getTopArtists(req.cookies.access_token, 'short_term', 1);
        res.send(topTracks);
    } catch (error) {
        res.status(400).send('Missing access token');
    }
});

app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
