import { INormalizedArtistAttributes } from "../normalizers/artist";
import PartialDate from "../PartialDate";
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
): Promise<Artist> => {
    const attributes = {
        ...DEFAULT_ATTRIBUTES,
        ...overrides,
    };

    return Artist.create(attributes);
};

describe("Artist", () => {
    describe(".create", () => {
        test("creates a new artist record", async () => {
            expect.assertions(9);

            const artist = await createArtist();

            expect(artist.country).toBe("US");
            expect(artist.disambiguation).toBeNull();
            expect(artist.ended_on_year).toBeNull();
            expect(artist.ended_on_month).toBeNull();
            expect(artist.ended_on_day).toBeNull();
            expect(artist.kind).toBe(ArtistKind.Person);
            expect(artist.started_on_year).toBe(1990);
            expect(artist.started_on_month).toBe(8);
            expect(artist.started_on_day).toBeNull();
        });
    });

    describe("#update", () => {
        test("updates an existing artist record", async () => {
            expect.assertions(9);

            let artist = await createArtist();

            artist = await artist.update({
                country: "GB",
                disambiguation: "group",
                endedOn: PartialDate.parse("2017"),
                kind: ArtistKind.Group,
            });

            expect(artist.country).toBe("GB");
            expect(artist.disambiguation).toBe("group");
            expect(artist.ended_on_year).toBe(2017);
            expect(artist.ended_on_month).toBeNull();
            expect(artist.ended_on_day).toBeNull();
            expect(artist.kind).toBe(ArtistKind.Group);
            expect(artist.started_on_year).toBe(1990);
            expect(artist.started_on_month).toBe(8);
            expect(artist.started_on_day).toBeNull();
        });
    });
});
