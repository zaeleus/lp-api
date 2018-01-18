import { INormalizedArtistNameAttributes } from "../normalizers/artist-name";

const artistId = (id: string): boolean => {
    if (id.length === 0) {
        throw new Error("'artistId' cannot be blank");
    }

    return true;
};

const locale = (l: string): boolean => {
    if (l.length === 0) {
        throw new Error("'locale' cannot be blank");
    }

    return true;
};

const name = (n: string): boolean => {
    if (n.length === 0) {
        throw new Error("'name' cannot be blank");
    }

    return true;
};

export const rules: any = {
    artistId,
    locale,
    name,
};

const validate = (
    attributes: Partial<INormalizedArtistNameAttributes>,
): boolean => {
    // FIXME: type assertion not guaranteed
    const keys = Object.keys(attributes) as Array<keyof INormalizedArtistNameAttributes>;

    for (const key of keys) {
        if (rules[key] && !rules[key](attributes[key])) {
            return false;
        }
    }

    return true;
};

export default validate;
