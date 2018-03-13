import * as knex from "knex";
import { transaction, Transaction } from "objection";

import { INormalizedArtistNameAttributes } from "../normalizers/artist-name";
import Artist from "./Artist";
import { createArtist } from "./Artist.test";
import ArtistName from "./ArtistName";

const DEFAULT_ATTRIBUTES = {
    artistId: "",
    id: "",
    isDefault: true,
    isOriginal: true,
    locale: "ko",
    name: "엑시",
};

const createArtistName = async (
    overrides: Partial<INormalizedArtistNameAttributes> = {},
    trxOrKnex?: Transaction | knex,
): Promise<ArtistName> => {
    let { artistId } = overrides;

    if (!artistId) {
        const artist = await createArtist({}, trxOrKnex);
        artistId = artist.id.toString();
    }

    const attributes = {
        ...DEFAULT_ATTRIBUTES,
        artistId,
        ...overrides,
    };

    return ArtistName.create(attributes, trxOrKnex);
};

describe("ArtistName", () => {
    test(".create", async () => {
        expect.assertions(5);

        const trx = await transaction.start(Artist.knex());

        try {
            const artist = await createArtist({}, trx);
            const name = await createArtistName({ artistId: artist.id.toString() }, trx);

            expect(name.artist_id).toBe(artist.id);
            expect(name.isDefault).toBe(true);
            expect(name.isOriginal).toBe(true);
            expect(name.locale).toBe("ko");
            expect(name.name).toBe("엑시");
        } finally {
            await trx.rollback();
        }
    });

    test("#update", async () => {
        expect.assertions(5);

        const trx = await transaction.start(Artist.knex());

        try {
            const artist = await createArtist({}, trx);
            let name = await createArtistName({ artistId: artist.id.toString() }, trx);

            name = await name.update({
                isDefault: false,
                isOriginal: false,
                locale: "ko-Latn",
                name: "Exy",
            }, trx);

            expect(name.artist_id).toBe(artist.id);
            expect(name.isDefault).toBe(false);
            expect(name.isOriginal).toBe(false);
            expect(name.locale).toBe("ko-Latn");
            expect(name.name).toBe("Exy");
        } finally {
            await trx.rollback();
        }
    });
});
