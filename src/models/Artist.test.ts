import PartialDate from "../PartialDate";
import Artist, { ArtistKind } from "./Artist";

describe("Artist", () => {
    describe(".create", () => {
        test("creates a new artist record", async () => {
            expect.assertions(9);

            const artist = await Artist.create({
                country: "US",
                disambiguation: undefined,
                endedOn: new PartialDate(),
                kind: ArtistKind.Person,
                startedOn: PartialDate.parse("1990-08"),
            });

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
});
