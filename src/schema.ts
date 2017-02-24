import { makeExecutableSchema } from "graphql-tools";
import * as moment from "moment";

import Album from "./models/Album";
import AlbumName from "./models/AlbumName";
import Artist from "./models/Artist";
import ArtistCredit from "./models/ArtistCredit";
import ArtistCreditName from "./models/ArtistCreditName";
import ArtistName from "./models/ArtistName";
import ArtistUrl from "./models/ArtistUrl";
import Contribution from "./models/Contribution";
import Medium from "./models/Medium";
import Membership from "./models/Membership";
import Release from "./models/Release";
import ReleaseUrl from "./models/ReleaseUrl";
import Song from "./models/Song";
import SongName from "./models/SongName";
import SongUrl from "./models/SongUrl";
import Track from "./models/Track";
import TrackName from "./models/TrackName";

const typeDefs = `
    enum AlbumKind {
        SINGLE,
        EP,
        LP,
    }

    type Album {
        id: ID!
        kind: AlbumKind!
        artistCredit: ArtistCredit!
        names: [AlbumName!]!
        releases: [Release!]!
        defaultRelease: Release!
    }

    type AlbumName {
        id: ID!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
    }

    enum ArtistKind {
        PERSON
        GROUP
    }

    type Artist {
        id: ID!
        kind: ArtistKind!
        country: String!
        disambiguation: String
        albums: [Album!]!
        names: [ArtistName!]!
        urls: [ArtistUrl!]!
        memberships: [Membership!]!
    }

    type ArtistCredit {
        id: ID!
        names: [ArtistCreditName!]!
    }

    type ArtistCreditName {
        id: ID!
        artist: Artist!
        position: Int!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
        separator: String!
    }

    type ArtistName {
        id: ID!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
    }

    type ArtistUrl {
        id: ID!
        url: String!
        name: String!
    }

    enum ContributionKind {
        PERFORMER
        ARRANGER
        COMPOSER
        LYRICIST
    }

    type Contribution {
        artistCredit: ArtistCredit!
        song: Song!
        kind: ContributionKind!
    }

    enum MediumKind {
        CD
        DVD
        BLU_RAY
        DIGITAL
        VINYL
    }

    type Medium {
        id: ID!
        kind: MediumKind!
        position: Int!
        name: String
        tracks: [Track!]!
    }

    type Membership {
        id: ID!
        group: Artist!
        artistCredit: ArtistCredit!
    }

    type Release {
        id: ID!
        releasedOn: String!
        country: String
        catalogNumber: String
        disambiguation: String
        album: Album!
        media: [Medium!]!
        urls: [ReleaseUrl!]!
    }

    type ReleaseUrl {
        id: ID!
        url: String!
        name: String!
    }

    type Song {
        id: ID!
        artistCredit: ArtistCredit!
        contributions: [Contribution!]!
        names: [SongName!]!
        urls: [SongUrl!]!
    }

    type SongName {
        id: ID!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
    }

    type SongUrl {
        id: ID!
        url: String!
        name: String!
    }

    type Track {
        id: ID!
        position: Int!
        duration: Int
        artistCredit: ArtistCredit!
        song: Song!
        names: [TrackName!]!
    }

    type TrackName {
        id: ID!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
    }

    type Query {
        albumsByReleaseMonth(date: String!): [Album!]!
        artist(id: ID!): Artist
        artists(query: String!): [Artist!]!
        artistsByStartMonth(month: Int!): [Artist!]!
        release(id: ID!): Release
    }
`;

const resolvers = {
    Album: {
        async artistCredit(album: Album): Promise<ArtistCredit> {
            try {
                const a = await album.$loadRelated("artistCredit");

                if (!a.artistCredit) {
                    throw new Error("failed to load album.artistCredit");
                }

                return a.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        kind(album: Album): string {
            switch (album.kind) {
                case 0: return "SINGLE";
                case 1: return "EP";
                case 2: return "LP";
                default: throw new Error("invalid album kind");
            }
        },

        async names(album: Album): Promise<AlbumName[]> {
            try {
                const a = await album.$loadRelated("names");
                return a.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async releases(album: Album): Promise<Release[]> {
            try {
                const a = await album.$loadRelated("releases");
                return a.releases || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async defaultRelease(album: Album): Promise<Release> {
            try {
                const a = await album.$loadRelated("releases");

                if (!a.releases) {
                    throw new Error("missing default release");
                }

                return a.releases[0];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Artist: {
        async albums(artist: Artist): Promise<Album[]> {
            try {
                const albums = await artist.albums();
                return albums || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        kind(artist: Artist): string {
            switch (artist.kind) {
                case 0: return "PERSON";
                case 1: return "GROUP";
                default: throw new Error("invalid artist kind");
            }
        },

        async memberships(artist: Artist): Promise<Membership[]> {
            try {
                const a = await artist.$loadRelated("memberships");
                return a.memberships || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async names(artist: Artist): Promise<ArtistName[]> {
            try {
                const a = await artist.$loadRelated("names");
                return a.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async urls(artist: Artist): Promise<ArtistUrl[]> {
            try {
                const a = await artist.$loadRelated("urls");
                return a.urls || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    ArtistCredit: {
        async names(artistCredit: ArtistCredit): Promise<ArtistCreditName[]> {
            try {
                const ac = await artistCredit.$loadRelated("names");
                return ac.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    ArtistCreditName: {
        async artist(name: ArtistCreditName): Promise<Artist> {
            try {
                const n = await name.$loadRelated("artist");

                if (!n.artist) {
                    throw new Error("failed to load membership.artist");
                }

                return n.artist;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Contribution: {
        async artistCredit(contribution: Contribution): Promise<ArtistCredit> {
            try {
                const c = await contribution.$loadRelated("artistCredit");

                if (!c.artistCredit) {
                    throw new Error("failed to load contribution.artistCredit");
                }

                return c.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        kind(album: Album): string {
            switch (album.kind) {
                case 0: return "SINGLE";
                case 1: return "EP";
                case 2: return "LP";
                default: throw new Error("invalid album kind");
            }
        },

        async song(contribution: Contribution): Promise<Song> {
            try {
                const c = await contribution.$loadRelated("song");

                if (!c.song) {
                    throw new Error("failed to load contribution.song");
                }

                return c.song;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Medium: {
        kind(medium: Medium): string {
            switch (medium.kind) {
                case 0: return "CD";
                case 1: return "DVD";
                case 2: return "BLU_RAY";
                case 3: return "DIGITAL";
                case 4: return "VINYL";
                default: throw new Error("invalid medium kind");
            }
        },

        async tracks(medium: Medium): Promise<Track[]> {
            try {
                const m = await medium.$loadRelated("tracks");
                return m.tracks || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Membership: {
        async artistCredit(membership: Membership): Promise<ArtistCredit> {
            try {
                const m = await membership.$loadRelated("artistCredit");

                if (!m.artistCredit) {
                    throw new Error("failed to load membership.artistCredit");
                }

                return m.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async group(membership: Membership): Promise<Artist> {
            try {
                const m = await membership.$loadRelated("group");

                if (!m.group) {
                    throw new Error("failed to load membership.artist");
                }

                return m.group;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Song: {
        async artistCredit(song: Song): Promise<ArtistCredit> {
            try {
                const s = await song.$loadRelated("artistCredit");

                if (!s.artistCredit) {
                    throw new Error("failed to load song.artistCredit");
                }

                return s.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async contributions(song: Song): Promise<Contribution[]> {
            try {
                const s = await song.$loadRelated("contributions");
                return s.contributions || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async names(song: Song): Promise<SongName[]> {
            try {
                const s = await song.$loadRelated("names");
                return s.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async urls(song: Song): Promise<SongUrl[]> {
            try {
                const s = await song.$loadRelated("urls");
                return s.urls || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Track: {
        async artistCredit(track: Track): Promise<ArtistCredit> {
            try {
                const t = await track.$loadRelated("artistCredit");

                if (!t.artistCredit) {
                    throw new Error("failed to load track.artistCredit");
                }

                return t.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async names(track: Track): Promise<TrackName[]> {
            try {
                const t = await track.$loadRelated("names");
                return t.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async song(track: Track): Promise<Song> {
            try {
                const t = await track.$loadRelated("song");

                if (!t.song) {
                    throw new Error("failed to load track.song");
                }

                return t.song;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Query: {
        async albumsByReleaseMonth(root: any, { date }: { date: string }): Promise<Album[]> {
            const parsedDate = moment(date, "YYYY-MM");
            const start = parsedDate.startOf("month").format("YYYY-MM-DD");
            const end = parsedDate.endOf("month").format("YYYY-MM-DD");

            try {
                return await Album.query()
                    .select("albums.*")
                    .innerJoin("releases", "albums.id", "releases.album_id")
                    .whereBetween("releases.released_on", [start, end])
                    .orderBy("releases.released_on");
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artist(root: any, { id }: { id: string }): Promise<Artist | null> {
            try {
                const artist = await Artist.query().findById(id);
                return artist || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artists(root: any, { query }: { query: string }): Promise<Artist[]> {
            try {
                return await Artist.search(query);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artistsByStartMonth(root: any, { month }: { month: number }): Promise<Artist[]> {
            try {
                return await Artist.query().where("started_on_month", "=", month);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async release(root: any, { id }: { id: string }): Promise<Release | null> {
            try {
                const release = await Release.query().findById(id);
                return release || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },

    Release: {
        async album(release: Release): Promise<Album> {
            try {
                const r = await release.$loadRelated("album");

                if (!r.album) {
                    throw new Error("failed to load release.album");
                }

                return r.album;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async media(release: Release): Promise<Medium[]> {
            try {
                const r = await release.$loadRelated("media");
                return r.media || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        releasedOn(release: Release): string {
            return moment(release.releasedOn).format("YYYY-MM-DD");
        },

        async urls(release: Release): Promise<ReleaseUrl[]> {
            try {
                const r = await release.$loadRelated("urls");
                return r.urls || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};

export default makeExecutableSchema({ typeDefs, resolvers });
