import * as knex from "knex";
import { transaction, Transaction } from "objection";

import Artist, { ArtistKind } from "../../models/Artist";
import { createArtistAndArtistNames, resolvers } from "./Mutation";

const DEFAULT_PAYLOAD = {
    input: {
        country: "KR",
        disambiguation: "",
        endedOn: "",
        kind: "PERSON",
        startedOn: "1993-08-12",

        names: [{
            isDefault: false,
            isOriginal: true,
            locale: "ko",
            name: "루나",
        }, {
            isDefault: true,
            isOriginal: false,
            locale: "ko-Latn",
            name: "Luna",
        }],
    },
};

describe("mutations Root resolvers", () => {
   describe("createArtist", () => {
        describe("with valid input", () => {
            let artist: Artist;
            let trx: Transaction;

            beforeAll(async () => {
                trx = await transaction.start(Artist.knex());

                artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                artist = await artist.$loadRelated("names(orderById)", {
                    orderById: (builder) => builder.orderBy("id"),
                }, trx);
            });

            afterAll(async () => {
                await trx.rollback();
            });

            test("creates a new artist", () => {
                expect(artist.id).not.toBe(null);
                expect(artist.country).toBe("KR");
                expect(artist.disambiguation).toBe(null);
                expect(artist.ended_on_year).toBe(null);
                expect(artist.ended_on_month).toBe(null);
                expect(artist.ended_on_day).toBe(null);
                expect(artist.kind).toBe(ArtistKind.Person);
                expect(artist.started_on_year).toBe(1993);
                expect(artist.started_on_month).toBe(8);
                expect(artist.started_on_day).toBe(12);
            });

            test("creates artist names", () => {
                expect.assertions(9);

                const names = artist.names;
                if (!names) { return; }

                expect(names.length).toBe(2);

                expect(names[0].is_default).toBe(false);
                expect(names[0].is_original).toBe(true);
                expect(names[0].locale).toBe("ko");
                expect(names[0].name).toBe("루나");

                expect(names[1].is_default).toBe(true);
                expect(names[1].is_original).toBe(false);
                expect(names[1].locale).toBe("ko-Latn");
                expect(names[1].name).toBe("Luna");
            });
        });

        describe("with invalid input", () => {
            const createArtist = () => {
                return resolvers.Mutation.createArtist({}, {
                    input: {
                        country: "",
                        kind: "",
                        names: [],
                    },
                });
            };

            test("throws an error", async () => {
                expect.assertions(1);
                await expect(createArtist()).rejects.toThrow();
            });

            test("rolls back the transaction", async () => {
                interface ICount { count: number; }

                expect.assertions(2);

                const beforeCounts: ICount[] = await Artist.query().count() as any[];

                const payload = { ...DEFAULT_PAYLOAD };
                payload.input.names[1].locale = "";

                const result = resolvers.Mutation.createArtist({}, payload);
                await expect(result).rejects.toThrow();

                const afterCounts: ICount[] = await Artist.query().count() as any[];

                expect(afterCounts[0].count).toBe(beforeCounts[0].count);
            });
        });
    });
});
