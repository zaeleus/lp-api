import { INormalizedArtistNameAttributes } from "../normalizers/artist-name";

const names = (n: INormalizedArtistNameAttributes[]): boolean => {
    if (n.length < 1) {
        const message = `artist must have at least one name (expected >= 1, got ${n.length})`;
        throw new Error(message);
    }

    let defaults = 0;
    let originals = 0;

    for (const name of n) {
        if (name.isDefault) { defaults += 1; }
        if (name.isOriginal) { originals += 1; }
    }

    if (defaults !== 1) {
        const message = `artist names can only have one default name (expected 1, got ${defaults})`;
        throw new Error(message);
    }

    if (originals !== 1) {
        const message = `artist names can only have one original name (expected 1, got ${originals})`;
        throw new Error(message);
    }

    return true;
};

export const rules: any = {
    names,
};

const validate = (
    attributes: INormalizedArtistNameAttributes[],
): boolean => (
    names(attributes)
);

export default validate;
