import { ArtistKind } from "../models/Artist";
import { rules } from "./artist";

describe("rules", () => {
    test("country", () => {
        expect(rules.country("US")).toBe("US");
        expect(rules.country("  US ")).toBe("US");
        expect(rules.country(undefined)).toBe("");
    });

    test("disambiguation", () => {
        expect(rules.disambiguation("singer")).toBe("singer");
        expect(rules.disambiguation("  singer ")).toBe("singer");
        expect(rules.disambiguation("")).toBeUndefined();
        expect(rules.disambiguation(undefined)).toBeUndefined();
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

    test("kind", () => {
        expect(rules.kind("PERSON")).toBe(ArtistKind.Person);
        expect(rules.kind("GROUP")).toBe(ArtistKind.Group);
        expect(rules.kind("foo")).toBe(ArtistKind.Unknown);
        expect(rules.kind(undefined)).toBe(ArtistKind.Unknown);
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
