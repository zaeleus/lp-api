import { Model } from "objection";

import Track from "./Track";

enum MediumKind {
    CD,
    DVD,
    BluRay,
    Digital,
    Vinyl,
}

class Medium extends Model {
    public static tableName = "media";

    public static relationMappings = {
        tracks: {
            join: {
                from: "media.id",
                to: "tracks.medium_id",
            },
            modelClass: `${__dirname}/Track`,
            relation: Model.HasManyRelation,
        },
    };

    // tslint:disable:variable-name
    public id: number;
    public release_id: number;
    public kind: MediumKind;
    public position: number;
    public name?: string;
    // tslint:enable:variable-name

    public tracks?: Track[];
}

export default Medium;
