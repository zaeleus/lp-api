import { Model } from "objection";

import ArtistCredit from "./ArtistCredit";
import Song from "./Song";

enum ContributionKind {
  Performer,
  Arranger,
  Composer,
  Lyricist,
}

class Contribution extends Model {
    public static tableName = "contributions";

    public static relationMappings = {
        artistCredit: {
            join: {
                from: "contributions.artist_credit_id",
                to: "artist_credits.id",
            },
            modelClass: `${__dirname}/ArtistCredit`,
            relation: Model.BelongsToOneRelation,
        },
        song: {
            join: {
                from: "contributions.song_id",
                to: "songs.id",
            },
            modelClass: `${__dirname}/Song`,
            relation: Model.BelongsToOneRelation,
        },
    };

    // tslint:disable:variable-name
    public id: number;
    public artist_credit_id: number;
    public song_id: number;
    public kind: ContributionKind;
    // tslint:enable:variable-name

    public artistCredit?: ArtistCredit;
    public song?: Song;
}

export default Contribution;
