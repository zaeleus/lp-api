import { LocalDate, ZoneOffset } from "js-joda";
import knex from "knex";
import { Model, Transaction } from "objection";

import { INormalizedArtistNameAttributes } from "../normalizers/artist-name";

class ArtistName extends Model {
    public static tableName = "artist_names";

    public static create(
        attributes: INormalizedArtistNameAttributes,
        trxOrKnex?: Transaction | knex,
    ): Promise<ArtistName> {
        const now = LocalDate.now(ZoneOffset.UTC).toString();

        const values = {
            artist_id: parseInt(attributes.artistId, 10),
            is_default: attributes.isDefault,
            is_original: attributes.isOriginal,
            locale: attributes.locale,
            name: attributes.name,

            created_at: now,
            updated_at: now,
        };

        return ArtistName.query(trxOrKnex).insertAndFetch(values);
    }

    public get isDefault(): boolean {
        return this.is_default;
    }

    public get isOriginal(): boolean {
        return this.is_original;
    }

    // tslint:disable:variable-name
    public id: number;
    public artist_id: number;
    public name: string;
    public locale: string;
    public is_default: boolean;
    public is_original: boolean;

    public created_at: string;
    public updated_at: string;
    // tslint:enable:variable-name

    public update(
        attributes: Partial<INormalizedArtistNameAttributes>,
        trxOrKnex?: Transaction | knex,
    ): Promise<ArtistName> {
        let artistId;

        if (attributes.artistId) {
            artistId = parseInt(attributes.artistId, 10);
        }

        const now = LocalDate.now(ZoneOffset.UTC).toString();

        const values = {
            artist_id: artistId,
            is_default: attributes.isDefault,
            is_original: attributes.isOriginal,
            locale: attributes.locale,
            name: attributes.name,

            updated_at: now,
        };

        return ArtistName.query(trxOrKnex).patchAndFetchById(this.id, values);
    }
}

export default ArtistName;
