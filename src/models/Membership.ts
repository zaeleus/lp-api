import { Model } from "objection";

import Artist from "./Artist";
import ArtistCredit from "./ArtistCredit";

class Membership extends Model {
    public static tableName = "memberships";

    public static relationMappings = {
        artistCredit: {
            join: {
                from: "memberships.artist_credit_id",
                to: "artist_credits.id",
            },
            modelClass: `${__dirname}/ArtistCredit`,
            relation: Model.BelongsToOneRelation,
        },
        group: {
            join: {
                from: "memberships.group_id",
                to: "artists.id",
            },
            modelClass: `${__dirname}/Artist`,
            relation: Model.BelongsToOneRelation,
        },
    };

    // tslint:disable:variable-name
    public id: number;
    public group_id: number;
    public artist_credit_id: number;
    public started_on_year?: number;
    public started_on_month?: number;
    public started_on_day?: number;
    public ended_on_year?: number;
    public ended_on_month?: number;
    public ended_on_day?: number;
    // tslint:enable:variable-name

    public group?: Artist;
    public artistCredit?: ArtistCredit;
}

export default Membership;
