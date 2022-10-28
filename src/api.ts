/* eslint-disable valid-jsdoc */
import axios from 'axios';

type TimeRange = 'short_term' | 'medium_term' | 'long_term';


/**
 * getTopTracks
 * @params limit: 0 =< limit =< 50
 */
export async function getTopTracks(access_token: string, range: TimeRange, limit: number) {
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

// Generated Types

export interface TopTracksReponse {
    items: Item[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    previous: null;
    next: string;
}

export interface Item {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
}

export interface Album {
    album_type: string;
    artists: Artist[];
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: Date;
    release_date_precision: string;
    total_tracks: number;
    type: string;
    uri: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Image {
    height: number;
    url: string;
    width: number;
}

export interface ExternalIDS {
    isrc: string;
}

