import Artist, { ArtistKind } from "../models/Artist";
import normalizer from "../normalizers/artist";

interface IAristNameInput {
    id: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

interface IArtistInput {
    id: string;
    disambigaution?: string;
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
        disambiguation: String
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
            const attributes = normalizer(input);

            let artist;

            try {
                artist = Artist.create(attributes);
            } catch (err) {
                throw new Error(err.message);
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
