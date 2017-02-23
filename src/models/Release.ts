import { Model } from "objection";

import Album from "./Album";
import ReleaseUrl from "./ReleaseUrl";

class Release extends Model {
    public static tableName = "releases";

    public static relationMappings = {
        album: {
            join: {
                from: "releases.album_id",
                to: "albums.id",
            },
            modelClass: `${__dirname}/Album`,
            relation: Model.BelongsToOneRelation,
        },
        urls: {
            join: {
                from: "releases.id",
                to: "release_urls.release_id",
            },
            modelClass: `${__dirname}/ReleaseUrl`,
            relation: Model.HasManyRelation,
        },
    };

    public get releasedOn(): Date {
        return this.released_on;
    }

    public get catalogNumber(): string | undefined {
        return this.catalog_number;
    }

    // tslint:disable:variable-name
    public id: number;
    public released_on: Date;
    public country?: string;
    public catalog_number?: string;
    public disambiguation?: string;
    // tslint:enable:variable-name

    public album?: Album;

    public urls?: ReleaseUrl[];
}

export default Release;
