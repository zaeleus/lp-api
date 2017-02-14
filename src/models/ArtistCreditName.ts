import { Model } from "objection";

import Artist from "./Artist";

class ArtistCreditName extends Model {
    public static tableName = "artist_credit_names";

    public static relationMappings = {
        artist: {
            join: {
                from: "artist_credit_names.artist_id",
                to: "artists.id",
            },
            modelClass: `${__dirname}/Artist`,
            relation: Model.BelongsToOneRelation,
        },
    };

    public get isDefault(): boolean {
        return this.is_default;
    }

    public get isOriginal(): boolean {
        return this.is_original;
    }

    // tslint:disable:variable-name
    public id: number;
    public artist_id: number;
    public artist_credit_id: number;
    public position: number;
    public name: string;
    public locale: string;
    public is_default: boolean;
    public is_original: boolean;
    public separator: string;
    // tslint:enable:variable-name

    public artist?: Artist;
}

export default ArtistCreditName;
