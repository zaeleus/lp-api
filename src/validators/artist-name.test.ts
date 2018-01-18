import { rules } from "./artist-name";

describe("rules", () => {
    test("artistId", () => {
        expect(rules.artistId("1")).toBe(true);
        expect(rules.artistId("101")).toBe(true);

        expect(() => rules.artistId("")).toThrow();
    });

    test("locale", () => {
        expect(rules.locale("en")).toBe(true);
        expect(rules.locale("ko-Latn")).toBe(true);

        expect(() => rules.locale("")).toThrow();
    });

    test("name", () => {
        expect(rules.locale("하니")).toBe(true);
        expect(rules.locale("Hani")).toBe(true);

        expect(() => rules.locale("")).toThrow();
    });
});
