import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { generateRandomString } from './utils';

const app = express();
dotenv.config();


// VARIABLES
const PORT = 8888;

const client_id = process.env.client_id!;
const client_secret = process.env.client_secret!;
const redirect_uri = process.env.redirect_uri!;

const stateKey = 'spotify_auth_state';

app.use(cors()).use(cookieParser());

// Main point
app.get('/', express.static(__dirname + '/public'));

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // HERE: your application requests authorization
    const scope = 'user-read-private user-read-email user-top-read';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
    });
    const URL = 'https://accounts.spotify.com/authorize?' + params.toString();
    console.log(URL);

    res.redirect(URL);
});

app.get('/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#error=state_mismatch');
    } else {
        res.clearCookie(stateKey);
        console.log('HERE');

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
            console.log(response.data);
            if (response.status === 200) {
                const access_token = response.data.access_token;
                const refresh_token = response.data.refresh_token;

                // use the access token to access the Spotify Web API
                axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                    },
                }).then((response) => {
                    console.log(response.data);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect(`/#access_token=${access_token}&refresh_token=${refresh_token}`);
            }
        }).catch(() => {
            res.redirect('/#error=invalid_token');
        });
    }
});

app.listen(PORT, () => {
    console.log(`App listen on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
