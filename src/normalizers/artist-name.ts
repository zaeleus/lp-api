export interface IArtistNameAttributes {
    id?: string;
    artistId?: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

export interface INormalizedArtistNameAttributes {
    id: string;
    artistId: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

const id = (i?: string): string => i ? i.trim() : "";

const artistId = (aid?: string): string => aid ? aid.trim() : "";

const isDefault = (b?: boolean): boolean => !!b;

const isOriginal = (b?: boolean): boolean => !!b;

const name = (s?: string): string => s ? s.trim() : "";

const locale = (s?: string): string => s ? s.trim() : "";

export const rules = {
    artistId,
    id,
    isDefault,
    isOriginal,
    locale,
    name,
};

const normalize = (attributes: Partial<IArtistNameAttributes>): INormalizedArtistNameAttributes => ({
    artistId: artistId(attributes.artistId),
    id: id(attributes.id),
    isDefault: isDefault(attributes.isDefault),
    isOriginal: isOriginal(attributes.isOriginal),
    locale: locale(attributes.locale),
    name: name(attributes.name),
});

export default normalize;
