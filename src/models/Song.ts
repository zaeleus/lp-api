import { Model } from "objection";

import ArtistCredit from "./ArtistCredit";
import Contribution from "./Contribution";
import SongName from "./SongName";
import SongUrl from "./SongUrl";

class Song extends Model {
    public static tableName = "songs";

    public static relationMappings = {
        artistCredit: {
            join: {
                from: "songs.artist_credit_id",
                to: "artist_credits.id",
            },
            modelClass: `${__dirname}/ArtistCredit`,
            relation: Model.BelongsToOneRelation,
        },
        contributions: {
            join: {
                from: "songs.id",
                to: "contributions.song_id",
            },
            modelClass: `${__dirname}/Contribution`,
            relation: Model.HasManyRelation,
        },
        names: {
            join: {
                from: "songs.id",
                to: "song_names.song_id",
            },
            modelClass: `${__dirname}/SongName`,
            relation: Model.HasManyRelation,
        },
        urls: {
            join: {
                from: "songs.id",
                to: "song_urls.song_id",
            },
            modelClass: `${__dirname}/SongUrl`,
            relation: Model.HasManyRelation,
        },
    };

    public static search(query: string): Promise<Song[]> {
        return Song.query()
            .select("songs.*")
            .innerJoin("song_names", "songs.id", "song_names.song_id")
            .where("song_names.name", "ILIKE", `%${query}%`)
            .groupBy("songs.id");
    }

    // tslint:disable:variable-name
    public id: number;
    public artist_credit_id: number;
    // tslint:enable:variable-name

    public artistCredit?: ArtistCredit;

    public contributions?: Contribution[];
    public names?: SongName[];
    public urls?: SongUrl[];
}

export default Song;
