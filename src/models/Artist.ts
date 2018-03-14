import { LocalDate, ZoneOffset } from "js-joda";
import knex from "knex";
import { Model, Transaction } from "objection";

import { INormalizedArtistAttributes } from "../normalizers/artist";
import Album from "./Album";
import ArtistName from "./ArtistName";
import ArtistUrl from "./ArtistUrl";
import Membership from "./Membership";
import Release from "./Release";

export enum ArtistKind {
    Person,
    Group,
    Unknown,
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

    public static create(
        attributes: INormalizedArtistAttributes,
        trxOrKnex?: Transaction | knex,
    ): Promise<Artist> {
        const { startedOn, endedOn } = attributes;
        const now = LocalDate.now(ZoneOffset.UTC).toString();

        const values = {
            country: attributes.country,
            disambiguation: attributes.disambiguation || null,
            kind: attributes.kind,

            started_on_day: startedOn.day || null,
            started_on_month: startedOn.month || null,
            started_on_year: startedOn.year || null,

            ended_on_day: endedOn.day || null,
            ended_on_month: endedOn.month || null,
            ended_on_year: endedOn.year || null,

            created_at: now,
            updated_at: now,
        };

        return Artist.query(trxOrKnex).insertAndFetch(values);
    }

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
    public disambiguation: string | null;

    public started_on_year: number | null;
    public started_on_month: number | null;
    public started_on_day: number | null;

    public ended_on_year: number | null;
    public ended_on_month: number | null;
    public ended_on_day: number | null;

    public created_at: string;
    public updated_at: string;
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

    public update(
        attributes: Partial<INormalizedArtistAttributes>,
        trxOrKnex?: Transaction | knex,
    ): Promise<Artist> {
        const { startedOn, endedOn } = attributes;

        // tslint:disable:variable-name
        let started_on_day;
        let started_on_month;
        let started_on_year;

        let ended_on_day;
        let ended_on_month;
        let ended_on_year;
        // tslint:enable:variable-name

        if (startedOn) {
            started_on_day = startedOn.day || null;
            started_on_month = startedOn.month || null;
            started_on_year = startedOn.year || null;
        }

        if (endedOn) {
            ended_on_day = endedOn.day || null;
            ended_on_month = endedOn.month || null;
            ended_on_year = endedOn.year || null;
        }

        const now = LocalDate.now(ZoneOffset.UTC).toString();

        const values = {
            country: attributes.country,
            disambiguation: attributes.disambiguation,
            kind: attributes.kind,

            started_on_day,
            started_on_month,
            started_on_year,

            ended_on_day,
            ended_on_month,
            ended_on_year,

            updated_at: now,
        };

        return Artist.query(trxOrKnex).patchAndFetchById(this.id, values);
    }
}

export default Artist;
