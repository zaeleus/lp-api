import { Model } from "objection";

import Album from "./Album";
import ArtistName from "./ArtistName";
import ArtistUrl from "./ArtistUrl";
import Membership from "./Membership";
import Release from "./Release";

export enum ArtistKind {
    Person,
    Group,
}

class Artist extends Model {
    public static tableName = "artists";

    public static relationMappings = {
        memberships: {
            join: {
                from: "artists.id",
                to: "memberships.group_id",
            },
            modelClass: `${__dirname}/Membership`,
            relation: Model.HasManyRelation,
        },
        names: {
            join: {
                from: "artists.id",
                to: "artist_names.artist_id",
            },
            modelClass: `${__dirname}/ArtistName`,
            relation: Model.HasManyRelation,
        },
        urls: {
            join: {
                from: "artists.id",
                to: "artist_urls.artist_id",
            },
            modelClass: `${__dirname}/ArtistUrl`,
            relation: Model.HasManyRelation,
        },
    };

    public static search(query: string): Promise<Artist[]> {
        return Artist.query()
            .select("artists.*")
            .innerJoin("artist_names", "artists.id", "artist_names.artist_id")
            .where("artist_names.name", "ILIKE", `%${query}%`)
            .groupBy("artists.id");
    }

    // tslint:disable:variable-name
    public id: number;
    public kind: ArtistKind;
    public country: string;
    public disambiguation?: string;
    public started_on_year?: number;
    public started_on_month?: number;
    public started_on_day?: number;
    public ended_on_year?: number;
    public ended_on_month?: number;
    public ended_on_day?: number;
    // tslint:enable:variable-name

    public memberships?: Membership[];
    public names?: ArtistName[];
    public urls?: ArtistUrl[];

    public albums(): Promise<Album[]> {
        const releasedOn = Release.query()
            .select("releases.released_on")
            .whereRaw("releases.album_id = albums.id")
            .orderBy("releases.released_on")
            .limit(1);

        return Album.query()
            .select("albums.*")
            .innerJoin("artist_credits", "albums.artist_credit_id", "artist_credits.id")
            .innerJoin("artist_credit_names", "artist_credits.id", "artist_credit_names.artist_credit_id")
            .where("artist_credit_names.artist_id", this.id)
            .groupBy("albums.id")
            .orderByRaw(`(${releasedOn.toString()}) desc`);
    }
}

export default Artist;
