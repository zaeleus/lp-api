import { ArtistKind } from "../models/Artist";
import { INormalizedArtistAttributes } from "../normalizers/artist";

const country = (c: string): boolean => {
    if (c.length !== 2) {
        throw new Error("'country' must be an ISO 3166-1 alpha-2 code");
    }

    return true;
};

const kind = (k: ArtistKind): boolean => {
    if (k === ArtistKind.Unknown) {
        throw new Error("'kind' is invalid");
    }

    return true;
};

export const rules: any = {
    country,
    kind,
};

const validate = (attributes: Partial<INormalizedArtistAttributes>): boolean => {
    // FIXME: type assertion not guaranteed
    const keys = Object.keys(attributes) as Array<keyof INormalizedArtistAttributes>;

    for (const key of keys) {
        if (rules[key] && !rules[key](attributes[key])) {
            return false;
        }
    }

    return true;
};

export default validate;
