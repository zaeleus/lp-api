import { makeExecutableSchema } from "graphql-tools";
import * as moment from "moment";

import Album from "./models/Album";
import AlbumName from "./models/AlbumName";
import Artist from "./models/Artist";
import ArtistCredit from "./models/ArtistCredit";
import ArtistCreditName from "./models/ArtistCreditName";
import ArtistName from "./models/ArtistName";
import ArtistUrl from "./models/ArtistUrl";
import Membership from "./models/Membership";
import Release from "./models/Release";

const typeDefs = `
    enum AlbumKind {
        SINGLE,
        EP,
        LP,
    }

    type Album {
        id: ID!
        kind: AlbumKind!
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
    }

    type Query {
        albumsByReleaseMonth(date: String!): [Album!]!
        artist(id: ID!): Artist
        artists(query: String!): [Artist!]!
        artistsByStartMonth(month: Int!): [Artist!]!
    }
`;

const resolvers = {
    Album: {
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

    Query: {
        async albumsByReleaseMonth(root: any, { date }: { date: string }): Promise<Album[]> {
            const parsedDate = moment(date, "YYYY-MM");
            const start = parsedDate.startOf("month").format("YYYY-MM-DD");
            const end = parsedDate.endOf("month").format("YYYY-MM-DD");

            try {
                return await Album.query()
                    .select("albums.*")
                    .innerJoin("releases", "albums.id", "releases.album_id")
                    .whereBetween("releases.released_on", [start, end]);
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
    },

    Release: {
        releasedOn(release: Release): string {
            return moment(release.releasedOn).format("YYYY-MM-DD");
        },
    },
};

export default makeExecutableSchema({ typeDefs, resolvers });
