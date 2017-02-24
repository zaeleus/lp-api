import { Model } from "objection";

import ArtistCredit from "./ArtistCredit";
import Song from "./Song";
import TrackName from "./TrackName";

class Track extends Model {
    public static tableName = "tracks";

    public static relationMappings = {
        artistCredit: {
            join: {
                from: "tracks.artist_credit_id",
                to: "artist_credits.id",
            },
            modelClass: `${__dirname}/ArtistCredit`,
            relation: Model.BelongsToOneRelation,
        },
        names: {
            join: {
                from: "tracks.id",
                to: "track_names.track_id",
            },
            modelClass: `${__dirname}/TrackName`,
            relation: Model.HasManyRelation,
        },
        song: {
            join: {
                from: "tracks.song_id",
                to: "songs.id",
            },
            modelClass: `${__dirname}/Song`,
            relation: Model.BelongsToOneRelation,
        },
    };

    // tslint:disable:variable-name
    public id: number;
    public artist_credit_id: number;
    // tslint:enable:variable-name

    public artistCredit?: ArtistCredit;
    public song?: Song;

    public names?: TrackName[];
}

export default Track;
