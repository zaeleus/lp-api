import { rules } from "./artist-name";

describe("rules", () => {
    test("isDefault", () => {
        expect(rules.isDefault(true)).toBe(true);
        expect(rules.isDefault(false)).toBe(false);
        expect(rules.isDefault(undefined)).toBe(false);
    });

    test("isOriginal", () => {
        expect(rules.isOriginal(true)).toBe(true);
        expect(rules.isOriginal(false)).toBe(false);
        expect(rules.isOriginal(undefined)).toBe(false);
    });

    test("name", () => {
        expect(rules.name("KARD")).toBe("KARD");
        expect(rules.name("  KARD ")).toBe("KARD");
        expect(rules.name(undefined)).toBe("");
    });

    test("locale", () => {
        expect(rules.locale("en")).toBe("en");
        expect(rules.locale("  en ")).toBe("en");
        expect(rules.locale(undefined)).toBe("");
    });
});
