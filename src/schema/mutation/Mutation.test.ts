import { transaction } from "objection";

import Artist, { ArtistKind } from "../../models/Artist";
import ArtistName from "../../models/ArtistName";
import {
    createArtistAndArtistNames,
    patchArtistAndArtistNames,
    resolvers,
} from "./Mutation";

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
            test("creates a new artist", async () => {
                expect.assertions(10);

                const trx = await transaction.start(Artist.knex());

                try {
                    let artist: Artist;

                    artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

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
                } finally {
                    await trx.rollback();
                }
            });

            test("creates artist names", async () => {
                expect.assertions(9);

                const trx = await transaction.start(Artist.knex());

                try {
                    let artist: Artist;

                    artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

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
                } finally {
                    await trx.rollback();
                }
            });
        });

        describe("with invalid input", () => {
            test("throws an error", async () => {
                expect.assertions(1);

                const result = resolvers.Mutation.createArtist({}, {
                    input: {
                        country: "",
                        kind: "",
                        names: [],
                    },
                });

                await expect(result).rejects.toThrow();
            });

            test("rolls back the transaction", async () => {
                interface ICount { count: number; }

                expect.assertions(2);

                const beforeCounts: ICount[] = await Artist.query().count() as any[];

                const payload = {
                    input: {
                        ...DEFAULT_PAYLOAD.input,
                        names: [
                            { ...DEFAULT_PAYLOAD.input.names[0] },
                            { ...DEFAULT_PAYLOAD.input.names[1], locale: "" },
                        ],
                    },
                };

                const result = resolvers.Mutation.createArtist({}, payload);
                await expect(result).rejects.toThrow();

                const afterCounts: ICount[] = await Artist.query().count() as any[];

                expect(afterCounts[0].count).toBe(beforeCounts[0].count);
            });
        });
    });

    describe("patchArtist", () => {
        describe("with valid input", () => {
            test("updates an existing artist", async () => {
                expect.assertions(10);

                const trx = await transaction.start(Artist.knex());

                try {
                    let artist: Artist;

                    artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

                    const input = {
                        country: "US",
                        disambiguation: "group",
                        id: artist.id.toString(),
                        kind: "GROUP",
                        startedOn: "1990",
                    };

                    artist = await patchArtistAndArtistNames(input, trx);

                    expect(artist.id.toString()).toBe(input.id);
                    expect(artist.country).toBe("US");
                    expect(artist.disambiguation).toBe("group");
                    expect(artist.ended_on_year).toBe(null);
                    expect(artist.ended_on_month).toBe(null);
                    expect(artist.ended_on_day).toBe(null);
                    expect(artist.kind).toBe(ArtistKind.Group);
                    expect(artist.started_on_year).toBe(1990);
                    expect(artist.started_on_month).toBe(null);
                    expect(artist.started_on_day).toBe(null);
                } finally {
                    await trx.rollback();
                }
            });

            test("creates artist names", async () => {
                expect.assertions(13);

                const trx = await transaction.start(Artist.knex());

                try {
                    let artist: Artist;
                    let names: ArtistName[] | undefined;

                    artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

                    names = artist.names;
                    if (!names) { return; }

                    const input = {
                        country: "KR",
                        id: artist.id.toString(),
                        kind: "PERSON",
                        names: [{
                            ...names[0],
                            id: names[0].id.toString(),
                            isDefault: names[0].is_default,
                            isOriginal: names[0].is_original,
                        }, {
                            ...names[1],
                            id: names[1].id.toString(),
                            isDefault: names[1].is_default,
                            isOriginal: names[1].is_original,
                        }, {
                            isDefault: false,
                            isOriginal: false,
                            locale: "ko-Latn",
                            name: "Park Sun Young",
                        }],
                    };

                    artist = await patchArtistAndArtistNames(input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

                    names = artist.names;
                    if (!names) { return; }

                    expect(names.length).toBe(3);

                    expect(names[0].is_default).toBe(false);
                    expect(names[0].is_original).toBe(true);
                    expect(names[0].locale).toBe("ko");
                    expect(names[0].name).toBe("루나");

                    expect(names[1].is_default).toBe(true);
                    expect(names[1].is_original).toBe(false);
                    expect(names[1].locale).toBe("ko-Latn");
                    expect(names[1].name).toBe("Luna");

                    expect(names[2].is_default).toBe(false);
                    expect(names[2].is_original).toBe(false);
                    expect(names[2].locale).toBe("ko-Latn");
                    expect(names[2].name).toBe("Park Sun Young");
                } finally {
                    await trx.rollback();
                }
            });

            test("updates artist names", async () => {
                expect.assertions(9);

                const trx = await transaction.start(Artist.knex());

                try {
                    let artist: Artist;
                    let names: ArtistName[] | undefined;

                    artist = await createArtistAndArtistNames(DEFAULT_PAYLOAD.input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

                    names = artist.names;
                    if (!names) { return; }

                    const input = {
                        country: "KR",
                        id: artist.id.toString(),
                        kind: "PERSON",
                        names: [{
                            id: names[0].id.toString(),
                            isDefault: true,
                            isOriginal: true,
                            locale: "ko",
                            name: "루다",
                        }, {
                            id: names[1].id.toString(),
                            isDefault: false,
                            isOriginal: false,
                            locale: "ko-Latn",
                            name: "Luda",
                        }],
                    };

                    artist = await patchArtistAndArtistNames(input, trx);
                    artist = await artist.$loadRelated("names(orderById)", {
                        orderById: (builder) => builder.orderBy("id"),
                    }, trx);

                    names = artist.names;
                    if (!names) { return; }

                    expect(names.length).toBe(2);

                    expect(names[0].is_default).toBe(true);
                    expect(names[0].is_original).toBe(true);
                    expect(names[0].locale).toBe("ko");
                    expect(names[0].name).toBe("루다");

                    expect(names[1].is_default).toBe(false);
                    expect(names[1].is_original).toBe(false);
                    expect(names[1].locale).toBe("ko-Latn");
                    expect(names[1].name).toBe("Luda");
                } finally {
                    await trx.rollback();
                }
            });
        });

        describe("with invalid input", () => {
            test("throws an error", async () => {
                expect.assertions(1);

                const result = resolvers.Mutation.patchArtist({}, {
                    input: {
                        country: "",
                        id: "",
                        kind: "",
                    },
                });

                await expect(result).rejects.toThrow();
            });
        });
    });
});
