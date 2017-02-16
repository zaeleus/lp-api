import { Model } from "objection";

import AlbumName from "./AlbumName";
import Release from "./Release";

enum AlbumKind {
    Single,
    EP,
    LP,
}

class Album extends Model {
    public static tableName = "albums";

    public static relationMappings = {
        names: {
            join: {
                from: "albums.id",
                to: "album_names.album_id",
            },
            modelClass: `${__dirname}/AlbumName`,
            relation: Model.HasManyRelation,
        },
        releases: {
            join: {
                from: "albums.id",
                to: "releases.album_id",
            },
            modelClass: `${__dirname}/Release`,
            relation: Model.HasManyRelation,
        },
    };

    public id: number;
    public kind: AlbumKind;

    public names?: AlbumName[];
    public releases?: Release[];
}

export default Album;
