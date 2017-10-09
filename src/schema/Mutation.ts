import Artist, { ArtistKind } from "../models/Artist";

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
        names: [ArtistNameInput]
    }

    type Mutation {
        patchArtist(input: ArtistInput!): Artist!
    }
`;

export const resolvers = {
    Mutation: {
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
