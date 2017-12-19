import { ArtistKind } from "../models/Artist";
import PartialDate from "../PartialDate";

export interface IArtistAttributes {
    country: string;
    disambiguation?: string;
    endedOn?: string;
    kind: string;
    startedOn?: string;
}

export interface INormalizedArtistAttributes {
    country: string;
    disambiguation?: string;
    endedOn: PartialDate;
    kind: ArtistKind;
    startedOn: PartialDate;
}

const country = (s?: string): string => s ? s.trim() : "";

const disambiguation = (s?: string): string | undefined => (
    s ? s.trim() : undefined
);

const endedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

const kind = (s?: string): ArtistKind => {
    if (s === "PERSON") {
        return ArtistKind.Person;
    } else if (s === "GROUP") {
        return ArtistKind.Group;
    } else {
        return ArtistKind.Unknown;
    }
};

const startedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

export const rules = {
    country,
    disambiguation,
    endedOn,
    kind,
    startedOn,
};

export const normalizePartial = (
    attributes: Partial<IArtistAttributes>,
): Partial<INormalizedArtistAttributes> => {
    // FIXME: This is not guaranteed. The following reducer, however, will skip
    // keys without rules defined.
    const keys = Object.keys(attributes) as Array<keyof IArtistAttributes>;

    return keys.reduce<Partial<INormalizedArtistAttributes>>((map, name) => {
        if (rules[name]) {
            map[name] = rules[name](attributes[name]);
        }

        return map;
    }, {});
};

const normalize = (attributes: Partial<IArtistAttributes>): INormalizedArtistAttributes => ({
    country: country(attributes.country),
    disambiguation: disambiguation(attributes.disambiguation),
    endedOn: endedOn(attributes.endedOn),
    kind: kind(attributes.kind),
    startedOn: startedOn(attributes.startedOn),
});

export default normalize;
