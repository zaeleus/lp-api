import { rules } from "./artist-names";

describe("rules", () => {
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
});
