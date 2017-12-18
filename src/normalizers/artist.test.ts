import { ArtistKind } from "../models/Artist";
import {
    normalizeCountry,
    normalizeDisambiguation,
    normalizeEndedOn,
    normalizeKind,
    normalizeStartedOn,
} from "./artist";

test("normalizeCountry", () => {
    expect(normalizeCountry("US")).toBe("US");
    expect(normalizeCountry("  US ")).toBe("US");
    expect(normalizeCountry(undefined)).toBe("");
});

test("normalizeDisambiguation", () => {
    expect(normalizeDisambiguation("singer")).toBe("singer");
    expect(normalizeDisambiguation("  singer ")).toBe("singer");
    expect(normalizeDisambiguation("")).toBeUndefined();
    expect(normalizeDisambiguation(undefined)).toBeUndefined();
});

test("normalizeEndedOn", () => {
    let d;

    d = normalizeEndedOn("2017-12");
    expect(d.toString()).toBe("2017-12");

    d = normalizeEndedOn("");
    expect(d.toString()).toBe("");

    d = normalizeEndedOn(undefined);
    expect(d.toString()).toBe("");
});

test("normalizeKind", () => {
    expect(normalizeKind("PERSON")).toBe(ArtistKind.Person);
    expect(normalizeKind("GROUP")).toBe(ArtistKind.Group);
    expect(normalizeKind("foo")).toBe(ArtistKind.Unknown);
    expect(normalizeKind(undefined)).toBe(ArtistKind.Unknown);
});

test("normalizeStartedOn", () => {
    let d;

    d = normalizeStartedOn("2017-12");
    expect(d.toString()).toBe("2017-12");

    d = normalizeStartedOn("");
    expect(d.toString()).toBe("");

    d = normalizeStartedOn(undefined);
    expect(d.toString()).toBe("");
});
