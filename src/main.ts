import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
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

app.use(cors({
    origin: 'http://127.0.0.1:5173',
    preflightContinue: true, // Use full?
})).use(cookieParser());


/**
 * Express Routing:
 * http://expressjs.com/en/guide/routing.html
 */

// Intercepts OPTIONS method
app.use((req, res, next) => {
    // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

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
                const params = new URLSearchParams({
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                });
                res.redirect('http://127.0.0.1:5173/?' + params.toString());
            }
        }).catch(() => {
            res.status(400).send('invalid_token');
        });
    }
});

app.get('/tracks', async (req, res) => {
    const { access_token } = req.query;

    if (!access_token) res.status(400).send('Missing access token');

    try {
        const topTracks = await getTopTracks(access_token as string, 'short_term', 10);
        // const topTracks = await getTopTracks(req.cookies.access_token, 'short_term', 10);

        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        res.send(topTracks);
    } catch (error) {
        res.status(400).send('Missing access token');
    }
});

app.get('/artists', async (req, res) => {
    try {
        const topTracks = await getTopArtists(req.cookies.access_token, 'short_term', 10);
        res.send(topTracks);
    } catch (error) {
        res.status(400).send('Missing access token');
    }
});

app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
