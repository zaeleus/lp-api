export interface IArtistNameAttributes {
    artistId?: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

export interface INormalizedArtistNameAttributes {
    artistId: string;
    name: string;
    locale: string;
    isDefault: boolean;
    isOriginal: boolean;
}

const artistId = (id?: string): string => id ? id.trim() : "";

const isDefault = (b?: boolean): boolean => !!b;

const isOriginal = (b?: boolean): boolean => !!b;

const name = (s?: string): string => s ? s.trim() : "";

const locale = (s?: string): string => s ? s.trim() : "";

export const rules = {
    isDefault,
    isOriginal,
    locale,
    name,
};

const normalize = (attributes: Partial<IArtistNameAttributes>): INormalizedArtistNameAttributes => ({
    artistId: artistId(attributes.artistId),
    isDefault: isDefault(attributes.isDefault),
    isOriginal: isOriginal(attributes.isOriginal),
    locale: locale(attributes.locale),
    name: name(attributes.name),
});

export default normalize;
