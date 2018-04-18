import Album from "../../models/Album";
import Artist from "../../models/Artist";
import ArtistName from "../../models/ArtistName";
import ArtistUrl from "../../models/ArtistUrl";
import Membership from "../../models/Membership";

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
        groupships: [Membership!]!
        memberships: [Membership!]!
    }
`;

export const resolvers = {
    Artist: {
        async albums(artist: Artist): Promise<Album[]> {
            const albums = await artist.albums();
            return albums || [];
        },

        endedOn(artist: Artist): string | null {
            const date = artist.endedOn().toString();
            return (date !== "") ? date : null;
        },

        groupships(artist: Artist): Promise<Membership[]> {
            return Membership.query()
                .select("memberships.*")
                .innerJoin("artist_credits", "memberships.artist_credit_id", "artist_credits.id")
                .innerJoin("artist_credit_names", "artist_credits.id", "artist_credit_names.artist_credit_id")
                .where("artist_credit_names.artist_id", artist.id)
                .groupBy("memberships.id");
        },

        kind(artist: Artist): string {
            switch (artist.kind) {
                case 0: return "PERSON";
                case 1: return "GROUP";
                default: throw new Error("invalid artist kind");
            }
        },

        async memberships(artist: Artist): Promise<Membership[]> {
            const a = await artist.$loadRelated("memberships");
            return a.memberships || [];
        },

        async names(artist: Artist): Promise<ArtistName[]> {
            const a = await artist.$loadRelated("names");
            return a.names || [];
        },

        startedOn(artist: Artist): string | null {
            const date = artist.startedOn().toString();
            return (date !== "") ? date : null;
        },

        async urls(artist: Artist): Promise<ArtistUrl[]> {
            const a = await artist.$loadRelated("urls");
            return a.urls || [];
        },
    },
};
