import Artist from "../../models/Artist";
import ArtistName from "../../models/ArtistName";
import normalizeArtist, {
    normalizePartial as normalizePartialArtist,
} from "../../normalizers/artist";
import normalizeArtistName, {
    IArtistNameAttributes,
    INormalizedArtistNameAttributes,
} from "../../normalizers/artist-name";
import validateArtist from "../../validators/artist";
import validateArtistName from "../../validators/artist-name";

interface IArtistNameInput {
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
    names?: IArtistNameInput[];
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

const normalizeArtistNames = (
    n?: Array<Partial<IArtistNameAttributes>>,
): INormalizedArtistNameAttributes[] => {
    if (!n) { return []; }
    return n.map((m) => normalizeArtistName(m));
};

const validateArtistNames = (n: INormalizedArtistNameAttributes[]): boolean => {
    if (n.length < 1) {
        const message = `artist must have at least one name (expected >= 1, got ${n.length})`;
        throw new Error(message);
    }

    let defaults = 0;
    let originals = 0;

    for (const name of n) {
        if (name.isDefault) { defaults += 1; }
        if (name.isOriginal) { originals += 1; }
    }

    if (defaults !== 1) {
        const message = `artist names can only have one default name (expected 1, got ${defaults})`;
        throw new Error(message);
    }

    if (originals !== 1) {
        const message = `artist names can only have one original name (expected 1, got ${originals})`;
        throw new Error(message);
    }

    return true;
};

export const resolvers = {
    Mutation: {
        async createArtist(_root: any, { input }: { input: IArtistInput }): Promise<Artist> {
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
                const artist = await Artist.query().findById(input.id);
                if (!artist) { throw new Error("artist not found"); }
                const attributes = normalizePartialArtist(input);
                validateArtist(attributes);
                return await artist.update(attributes);
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
