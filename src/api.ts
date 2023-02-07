/* eslint-disable valid-jsdoc */
import axios from 'axios';
import { TopArtistsReponse, TopTracksReponse } from './types/Spotify';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

/**
 * getTopTracks
 * @params limit: 0 =< limit =< 50
 */
export async function getTopTracks(access_token: string, range: TimeRange, limit: number): Promise<TopTracksReponse> {
    const baseURL = 'https://api.spotify.com/v1/me/top/tracks';
    const params = new URLSearchParams({
        limit: limit.toString(),
        time_range: range,
    });
    const URL = `${baseURL}?${params.toString()}`;

    const response = await axios.get(URL, {
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    });

    return response.data;
}

/**
 * getTopArtists
 * @params limit: 0 =< limit =< 50
 */
export async function getTopArtists(access_token: string, range: TimeRange, limit: number): Promise<TopArtistsReponse> {
    const baseURL = 'https://api.spotify.com/v1/me/top/artists';
    const params = new URLSearchParams({
        limit: limit.toString(),
        time_range: range,
    });
    const URL = `${baseURL}?${params.toString()}`;

    const response = await axios.get(URL, {
        headers: {
            Authorization: 'Bearer ' + access_token,
        },
    });

    return response.data;
}
