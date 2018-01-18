import { ArtistKind } from "../models/Artist";
import validate, { rules } from "./artist";

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

test("names", () => {
    expect(() => rules.names([])).toThrow();

    expect(rules.names([
        { name: "a", locale: "en", isOriginal: true, isDefault: false },
        { name: "b", locale: "en", isOriginal: false, isDefault: true },
    ])).toBe(true);

    expect(rules.names([
        { name: "a", locale: "en", isOriginal: true, isDefault: true },
        { name: "b", locale: "en", isOriginal: false, isDefault: false },
    ])).toBe(true);

    expect(() => {
        rules.names([
            { name: "a", locale: "en", isOriginal: true, isDefault: true },
            { name: "b", locale: "en", isOriginal: false, isDefault: true },
        ]);
    }).toThrow();

    expect(() => {
        rules.names([
            { name: "a", locale: "en", isOriginal: true, isDefault: true },
            { name: "b", locale: "en", isOriginal: true, isDefault: true },
        ]);
    }).toThrow();
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
