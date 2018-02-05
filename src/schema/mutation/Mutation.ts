import Artist from "../../models/Artist";
import ArtistName from "../../models/ArtistName";
import normalizeArtist, {
    normalizePartial as normalizePartialArtist,
} from "../../normalizers/artist";
import normalizeArtistName from "../../normalizers/artist-name";
import normalizeArtistNames from "../../normalizers/artist-names";
import validateArtist from "../../validators/artist";
import validateArtistName from "../../validators/artist-name";
import validateArtistNames from "../../validators/artist-names";

interface IArtistNameInput {
    id?: string;
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
    names?: IArtistNameInput[];
}

interface INewArtistInput {
    disambigaution?: string;
    kind: string;
    country: string;
    startedOn?: string;
    endedOn?: string;
    names: IArtistNameInput[];
}

export const typeDefs = `
    input ArtistNameInput {
        id: ID
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
        names: [ArtistNameInput!]
    }

    input NewArtistInput {
        disambiguation: String
        kind: String!
        country: String!
        startedOn: String
        endedOn: String
        names: [ArtistNameInput!]!
    }

    type Mutation {
        createArtist(input: NewArtistInput!): Artist!
        patchArtist(input: ArtistInput!): Artist!
    }
`;

export const resolvers = {
    Mutation: {
        async createArtist(_root: any, { input }: { input: INewArtistInput }): Promise<Artist> {
            const attributes = normalizeArtist(input);
            validateArtist(attributes);

            let artist;

            try {
                artist = await Artist.create(attributes);

                const artistNamesAttributes = normalizeArtistNames(input.names);
                validateArtistNames(artistNamesAttributes);

                const artistId = artist.id.toString();

                for (const name of artistNamesAttributes) {
                    const artistNameAttributes = normalizeArtistName({
                        artistId,
                        isDefault: name.isDefault,
                        isOriginal: name.isOriginal,
                        locale: name.locale,
                        name: name.name,
                    });

                    validateArtistName(artistNameAttributes);

                    await ArtistName.create(artistNameAttributes);
                }
            } catch (err) {
                throw new Error(err.message);
            }

            return artist;
        },

        async patchArtist(_root: any, { input }: { input: IArtistInput }): Promise<Artist> {
            try {
                const artistId = input.id;
                const artist = await Artist.query().findById(artistId);

                if (!artist) { throw new Error("artist not found"); }

                const attributes = normalizePartialArtist(input);
                validateArtist(attributes);

                artist.update(attributes);

                if (input.names) {
                    const artistNamesAttributes = normalizeArtistNames(input.names);
                    validateArtistNames(artistNamesAttributes);

                    for (const name of artistNamesAttributes) {
                        const artistNameAttributes = normalizeArtistName({
                            artistId,
                            isDefault: name.isDefault,
                            isOriginal: name.isOriginal,
                            locale: name.locale,
                            name: name.name,
                        });

                        validateArtistName(artistNameAttributes);

                        if (name.id.length > 0) {
                            const artistName = await ArtistName.query().findById(name.id);
                            if (!artistName) { throw new Error("artist name not found"); }
                            await artistName.update(artistNameAttributes);
                        } else {
                            await ArtistName.create(artistNameAttributes);
                        }
                    }
                }

                return await artist.update(attributes);
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
