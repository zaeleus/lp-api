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

export const normalizeCountry = (s?: string): string => (
    (s) ? s.trim() : ""
);

export const normalizeDisambiguation = (s?: string): string | undefined => (
    (s) ? s.trim() : undefined
);

export const normalizeEndedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

export const normalizeKind = (s?: string): ArtistKind => {
    if (s === "PERSON") {
        return ArtistKind.Person;
    } else if (s === "GROUP") {
        return ArtistKind.Group;
    } else {
        return ArtistKind.Unknown;
    }
};

export const normalizeStartedOn = (s?: string): PartialDate => {
    if (s) {
        return PartialDate.parse(s);
    } else {
        return new PartialDate();
    }
};

const normalize = (attributes: Partial<IArtistAttributes>): INormalizedArtistAttributes => {
    return {
        country: normalizeCountry(attributes.country),
        disambiguation: normalizeDisambiguation(attributes.disambiguation),
        endedOn: normalizeEndedOn(attributes.endedOn),
        kind: normalizeKind(attributes.kind),
        startedOn: normalizeStartedOn(attributes.startedOn),
    };
};

export default normalize;
