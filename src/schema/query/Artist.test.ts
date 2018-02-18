import Artist, { ArtistKind } from "../../models/Artist";
import { resolvers } from "./Artist";

describe("query Artist resolvers", () => {
    describe("kind", () => {
        test("returns the string representation of kind", () => {
            const artist = new Artist();
            let kind;

            artist.kind = ArtistKind.Person;
            kind = resolvers.Artist.kind(artist);
            expect(kind).toBe("PERSON");

            artist.kind = ArtistKind.Group;
            kind = resolvers.Artist.kind(artist);
            expect(kind).toBe("GROUP");
        });

        test("throws an error if the model has an invalid kind", () => {
            const artist = Artist.fromJson({ kind: ArtistKind.Unknown });
            expect(() => resolvers.Artist.kind(artist)).toThrow();
        });
    });
});
