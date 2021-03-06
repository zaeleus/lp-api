import knex from "knex";
import { transaction, Transaction } from "objection";

import Artist from "../../models/Artist";
import ArtistName from "../../models/ArtistName";
import normalizeArtist, {
    normalizePartial as normalizePartialArtist,
} from "../../normalizers/artist";
import { INormalizedArtistNameAttributes } from "../../normalizers/artist-name";
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
        createArtist(_root: any, { input }: { input: INewArtistInput }): Promise<Artist> {
            return transaction(Artist.knex(), (trx) => (
                createArtistAndArtistNames(input, trx)
            ));
        },

        patchArtist(_root: any, { input }: { input: IArtistInput }): Promise<Artist> {
            return transaction(Artist.knex(), (trx) => (
                patchArtistAndArtistNames(input, trx)
            ));
        },
    },
};

export const createArtistAndArtistNames = async (
    input: INewArtistInput,
    trxOrKnex?: Transaction | knex,
): Promise<Artist> => {
    const attributes = normalizeArtist(input);
    validateArtist(attributes);
    const artist = await Artist.create(attributes, trxOrKnex);

    const artistId = artist.id.toString();
    await createOrUpdateArtistNames(artistId, input.names, trxOrKnex);

    return artist;
};

export const patchArtistAndArtistNames = async (
    input: IArtistInput,
    trxOrKnex?: Transaction | knex,
): Promise<Artist> => {
    const artistId = input.id;
    let artist = await Artist.query(trxOrKnex).findById(artistId);

    if (!artist) {
        throw new Error(`artist not found (id = ${artistId})`);
    }

    const attributes = normalizePartialArtist(input);
    validateArtist(attributes);
    artist = await artist.update(attributes, trxOrKnex);

    if (input.names) {
        await createOrUpdateArtistNames(artistId, input.names, trxOrKnex);
    }

    return artist;
};

const createOrUpdateArtistNames = async (
    artistId: string,
    input: IArtistNameInput[],
    trxOrKnex?: Transaction | knex,
) => {
    const attributes = normalizeArtistNames(input);
    validateArtistNames(attributes);

    for (const attrs of attributes) {
        attrs.artistId = artistId;
        await createOrUpdateArtistName(attrs, trxOrKnex);
    }
};

const createOrUpdateArtistName = async (
    attributes: INormalizedArtistNameAttributes,
    trxOrKnex?: Transaction | knex,
): Promise<ArtistName> => {
    validateArtistName(attributes);

    if (attributes.id.length > 0) {
        const name = await ArtistName.query(trxOrKnex).findById(attributes.id);
        if (!name) { throw new Error("artist name not found"); }
        return name.update(attributes, trxOrKnex);
    } else {
        return ArtistName.create(attributes, trxOrKnex);
    }
};
