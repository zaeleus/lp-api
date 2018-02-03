import { ArtistKind } from "../models/Artist";
import validate, { rules } from "./artist";

describe("rules", () => {
    test("country", () => {
        expect(rules.country("US")).toBe(true);
        expect(rules.country("XX")).toBe(true);

        expect(() => rules.country("")).toThrow();
        expect(() => rules.country("U")).toThrow();
        expect(() => rules.country("USA")).toThrow();
        expect(() => rules.country("United States")).toThrow();
    });

    test("kind", () => {
        expect(rules.kind(ArtistKind.Person)).toBe(true);
        expect(rules.kind(ArtistKind.Group)).toBe(true);

        expect(() => rules.kind(ArtistKind.Unknown)).toThrow();
    });

    test("validate", () => {
        expect(validate({})).toBe(true);
        expect(validate({ country: "US" })).toBe(true);
        expect(validate({
            country: "US",
            kind: ArtistKind.Person,
        })).toBe(true);

        expect(() => validate({ country: "" })).toThrow();
    });
});
