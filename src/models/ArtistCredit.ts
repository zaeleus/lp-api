import { Model } from "objection";

import ArtistCreditName from "./ArtistCreditName";

class ArtistCredit extends Model {
    public static tableName = "artist_credits";

    public static relationMappings = {
        names: {
            join: {
                from: "artist_credits.id",
                to: "artist_credit_names.artist_credit_id",
            },
            modelClass: `${__dirname}/ArtistCreditName`,
            relation: Model.HasManyRelation,
        },
    };

    public id: number;

    public names?: ArtistCreditName[];
}

export default ArtistCredit;
