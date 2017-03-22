import { Model } from "objection";

import Album from "./Album";
import Medium from "./Medium";
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
        media: {
            join: {
                from: "releases.id",
                to: "media.release_id",
            },
            modelClass: `${__dirname}/Medium`,
            relation: Model.HasManyRelation,
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

    public get artworkData(): string | undefined {
        return this.artwork_data;
    }

    public get releasedOn(): Date {
        return this.released_on;
    }

    public get catalogNumber(): string | undefined {
        return this.catalog_number;
    }

    public siblings(): Promise<Release[]> {
        return Release.query()
            .where("album_id", "=", this.album_id)
            .andWhere("id", "!=", this.id);
    }

    // tslint:disable:variable-name
    public id: number;
    public album_id: number;
    public released_on: Date;
    public country?: string;
    public catalog_number?: string;
    public disambiguation?: string;
    public artwork_data?: string;
    // tslint:enable:variable-name

    public album?: Album;

    public urls?: ReleaseUrl[];
    public media?: Medium[];
}

export default Release;
