import Album from "../models/Album";
import Artist from "../models/Artist";
import ArtistName from "../models/ArtistName";
import ArtistUrl from "../models/ArtistUrl";
import Membership from "../models/Membership";

export const typeDefs = `
    enum ArtistKind {
        PERSON
        GROUP
    }

    type Artist {
        id: ID!
        kind: ArtistKind!
        country: String!
        disambiguation: String
        startedOn: String
        endedOn: String
        albums: [Album!]!
        names: [ArtistName!]!
        urls: [ArtistUrl!]!
        memberships: [Membership!]!
    }
`;

export const resolvers = {
    Artist: {
        async albums(artist: Artist): Promise<Album[]> {
            try {
                const albums = await artist.albums();
                return albums || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        endedOn(artist: Artist): string | null {
            const pieces = [artist.ended_on_year, artist.ended_on_month, artist.ended_on_day];
            const date = pieces.filter((p) => p).join("-");
            return (date !== "") ? date : null;
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

        startedOn(artist: Artist): string | null {
            const pieces = [artist.started_on_year, artist.started_on_month, artist.started_on_day];
            const date = pieces.filter((p) => p).join("-");
            return (date !== "") ? date : null;
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
};
