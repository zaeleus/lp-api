import { rules } from "./membership";

describe("rules", () => {
    test("artistId", () => {
        expect(rules.artistId("1")).toBe(true);
        expect(rules.artistId("101")).toBe(true);

        expect(() => rules.artistId("")).toThrow();
    });
});
