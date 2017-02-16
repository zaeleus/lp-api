import { Model } from "objection";

import AlbumName from "./AlbumName";

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
    };

    public id: number;
    public kind: AlbumKind;

    public names?: AlbumName[];
}

export default Album;
