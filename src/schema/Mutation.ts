import Artist from "../models/Artist";
import normalize, { normalizePartial } from "../normalizers/artist";

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
            const attributes = normalize(input);

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
                const artist = await Artist.query().findById(input.id);
                if (!artist) { throw new Error("artist not found"); }
                const attributes = normalizePartial(input);
                return await artist.update(attributes);
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
