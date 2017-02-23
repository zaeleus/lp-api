import { Model } from "objection";

import AlbumName from "./AlbumName";
import ArtistCredit from "./ArtistCredit";
import Release from "./Release";

enum AlbumKind {
    Single,
    EP,
    LP,
}

class Album extends Model {
    public static tableName = "albums";

    public static relationMappings = {
        artistCredit: {
            join: {
                from: "albums.artist_credit_id",
                to: "artist_credits.id",
            },
            modelClass: `${__dirname}/ArtistCredit`,
            relation: Model.BelongsToOneRelation,
        },
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

    public artistCredit?: ArtistCredit;

    public names?: AlbumName[];
    public releases?: Release[];
}

export default Album;
