import { IArtistNameAttributes, INormalizedArtistNameAttributes } from "./artist-name";
import { rules } from "./artist-names";

describe("rules", () => {
    test("names", () => {
        const attributes: IArtistNameAttributes[] = [{
            artistId: "1",
            isDefault: false,
            isOriginal: true,
            locale: "ko",
            name: "수지",
        }, {
            artistId: "1",
            isDefault: true,
            isOriginal: false,
            locale: "en",
            name: "Suzy",
        }];

        const expected: INormalizedArtistNameAttributes[] = [{
            artistId: "1",
            id: "",
            isDefault: false,
            isOriginal: true,
            locale: "ko",
            name: "수지",
        }, {
            artistId: "1",
            id: "",
            isDefault: true,
            isOriginal: false,
            locale: "en",
            name: "Suzy",
        }];

        expect(rules.names(attributes)).toEqual(expected);

        expect(rules.names(undefined)).toEqual([]);
    });
});
