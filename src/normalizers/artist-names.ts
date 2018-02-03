import normalizeArtistName, {
    IArtistNameAttributes,
    INormalizedArtistNameAttributes,
} from "./artist-name";

const names = (
    n?: Array<Partial<IArtistNameAttributes>>,
): INormalizedArtistNameAttributes[] => {
    if (!n) { return []; }
    return n.map((m) => normalizeArtistName(m));
};

export const rules = {
    names,
};

const normalize = (
    attributes: Array<Partial<IArtistNameAttributes>>,
): INormalizedArtistNameAttributes[] => (
    names(attributes)
);

export default normalize;
