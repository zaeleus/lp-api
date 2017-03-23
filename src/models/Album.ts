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

    public static search(query: string): Promise<Album[]> {
        return Album.query()
            .select("albums.*")
            .innerJoin("album_names", "albums.id", "album_names.album_id")
            .where("album_names.name", "ILIKE", `%${query}%`)
            .groupBy("albums.id");
    };

    public id: number;
    public kind: AlbumKind;

    public artistCredit?: ArtistCredit;

    public names?: AlbumName[];
    public releases?: Release[];
}

export default Album;
