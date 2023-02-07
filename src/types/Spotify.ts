// Generated Types

export interface TopTracksReponse {
    items: TopTrack[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    previous: string | null;
    next: string | null;
}

export interface TopTrack {
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

export interface TopArtistsReponse {
    items: TopArtist[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    previous: string | null;
    next: string | null;
}

export interface TopArtist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
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

export interface Followers {
    href: null;
    total: number;
}
