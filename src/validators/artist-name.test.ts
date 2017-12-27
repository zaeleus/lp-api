import { rules } from "./artist-name";

describe("rules", () => {
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
