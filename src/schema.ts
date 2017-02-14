import { makeExecutableSchema } from "graphql-tools";

import Artist from "./models/Artist";
import ArtistCredit from "./models/ArtistCredit";
import ArtistCreditName from "./models/ArtistCreditName";
import ArtistName from "./models/ArtistName";
import ArtistUrl from "./models/ArtistUrl";
import Membership from "./models/Membership";

const typeDefs = `
    enum ArtistKind {
        PERSON
        GROUP
    }

    type Artist {
        id: ID!
        kind: ArtistKind!
        country: String!
        disambiguation: String
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

    type Query {
        artist(id: ID!): Artist
        artists(query: String!): [Artist!]!
        artistsByStartMonth(month: Int!): [Artist!]!
    }
`;

const resolvers = {
    Artist: {
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
        }
    },
};

export default makeExecutableSchema({ typeDefs, resolvers });
