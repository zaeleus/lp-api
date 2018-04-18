import { rules } from "./membership";

describe("rules", () => {
    test("artistId", () => {
        expect(rules.artistId("1")).toBe("1");
        expect(rules.artistId("  101 ")).toBe("101");
        expect(rules.artistId(undefined)).toBe("");
    });

    test("endedOn", () => {
        let d;

        d = rules.endedOn("2017-12");
        expect(d.toString()).toBe("2017-12");

        d = rules.endedOn("");
        expect(d.toString()).toBe("");

        d = rules.endedOn(undefined);
        expect(d.toString()).toBe("");
    });

    test("id", () => {
        expect(rules.id("1")).toBe("1");
        expect(rules.id("  101 ")).toBe("101");
        expect(rules.id(undefined)).toBe("");
    });

    test("startedOn", () => {
        let d;

        d = rules.startedOn("2017-12");
        expect(d.toString()).toBe("2017-12");

        d = rules.startedOn("");
        expect(d.toString()).toBe("");

        d = rules.startedOn(undefined);
        expect(d.toString()).toBe("");
    });
});
