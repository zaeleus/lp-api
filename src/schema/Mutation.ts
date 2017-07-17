import Artist, { ArtistKind } from "../models/Artist";

interface IArtistInput {
    id: string;
    kind: string;
}

export const typeDefs = `
    input ArtistInput {
        id: ID!
        kind: String!
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
                    kind: (input.kind === "PERSON") ? ArtistKind.Person : ArtistKind.Group,
                });
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
