import Artist, { ArtistKind } from "../models/Artist";
import ArtistName from "../models/ArtistName";

interface IAristNameInput {
    id: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

interface IArtistInput {
    id: string;
    kind: string;
    country: string;
    startedOn?: string;
    endedOn?: string;
    names: IAristNameInput[];
}

export const typeDefs = `
    input ArtistNameInput {
        id: ID!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
    }

    input ArtistInput {
        id: ID!
        kind: String!
        country: String!
        startedOn: String
        endedOn: String
        names: [ArtistNameInput]
    }

    type Mutation {
        createArtist(input: ArtistInput!): Artist!
        patchArtist(input: ArtistInput!): Artist!
    }
`;

export const resolvers = {
    Mutation: {
        async createArtist(_root: any, { input }: { input: IArtistInput }): Promise<Artist> {
            let artist;

            try {
                artist = await Artist.query().insert({
                    // kind: input.kind,
                    country: input.country,
                });
            } catch (err) {
                throw new Error(err.message);
            }

            for (const name of input.names) {
                await ArtistName.query().insert({
                    // artist_id: artist.id,
                    is_default: name.isDefault,
                    is_original: name.isOriginal,
                    locale: name.locale,
                    name: name.name,
                });
            }

            return artist;
        },

        async patchArtist(_root: any, { input }: { input: IArtistInput }): Promise<Artist> {
            try {
                return await Artist.query().patchAndFetchById(input.id, {
                    country: input.country,
                    kind: (input.kind === "PERSON") ? ArtistKind.Person : ArtistKind.Group,
                });
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
