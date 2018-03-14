import knex from "knex";
import { transaction, Transaction } from "objection";

import { INormalizedArtistAttributes } from "../normalizers/artist";
import PartialDate from "../util/PartialDate";
import Artist, { ArtistKind } from "./Artist";

const DEFAULT_ATTRIBUTES = {
    country: "US",
    disambiguation: undefined,
    endedOn: new PartialDate(),
    kind: ArtistKind.Person,
    startedOn: PartialDate.parse("1990-08"),
};

export const createArtist = (
    overrides: Partial<INormalizedArtistAttributes> = {},
    trxOrKnex?: Transaction | knex,
): Promise<Artist> => {
    const attributes = {
        ...DEFAULT_ATTRIBUTES,
        ...overrides,
    };

    return Artist.create(attributes, trxOrKnex);
};

describe("Artist", () => {
    describe(".create", () => {
        test("creates a new artist record", async () => {
            expect.assertions(9);

            const trx = await transaction.start(Artist.knex());

            try {
                const artist = await createArtist({}, trx);

                expect(artist.country).toBe("US");
                expect(artist.disambiguation).toBeNull();
                expect(artist.ended_on_year).toBeNull();
                expect(artist.ended_on_month).toBeNull();
                expect(artist.ended_on_day).toBeNull();
                expect(artist.kind).toBe(ArtistKind.Person);
                expect(artist.started_on_year).toBe(1990);
                expect(artist.started_on_month).toBe(8);
                expect(artist.started_on_day).toBeNull();
            } finally {
                await trx.rollback();
            }
        });
    });

    describe("#update", () => {
        test("updates an existing artist record", async () => {
            expect.assertions(9);

            const trx = await transaction.start(Artist.knex());

            try {
                let artist = await createArtist({}, trx);

                artist = await artist.update({
                    country: "GB",
                    disambiguation: "group",
                    endedOn: PartialDate.parse("2017"),
                    kind: ArtistKind.Group,
                }, trx);

                expect(artist.country).toBe("GB");
                expect(artist.disambiguation).toBe("group");
                expect(artist.ended_on_year).toBe(2017);
                expect(artist.ended_on_month).toBeNull();
                expect(artist.ended_on_day).toBeNull();
                expect(artist.kind).toBe(ArtistKind.Group);
                expect(artist.started_on_year).toBe(1990);
                expect(artist.started_on_month).toBe(8);
                expect(artist.started_on_day).toBeNull();
            } finally {
                await trx.rollback();
            }
        });
    });
});
