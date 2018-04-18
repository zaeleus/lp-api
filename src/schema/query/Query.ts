import { YearMonth } from "js-joda";
import { QueryBuilder } from "objection";

import Album from "../../models/Album";
import Artist, { ArtistKind } from "../../models/Artist";
import Release from "../../models/Release";
import Song from "../../models/Song";

export const typeDefs = `
    type Query {
        albums(query: String!): [Album!]!
        albumsByReleaseMonth(date: String!): [Album!]!
        artist(id: ID!): Artist
        artists(query: String!, limit: Int): [Artist!]!
        artistsByStartMonth(date: String!): [Artist!]!
        recentAlbums(first: Int = 8): [Album!]!
        release(id: ID!): Release
        song(id: ID!): Song
        songs(query: String!): [Song!]!
    }
`;

export const resolvers = {
    Query: {
        albums(_root: any, { query }: { query: string }): Promise<Album[]> {
            return Album.search(query);
        },

        albumsByReleaseMonth(_root: any, { date }: { date: string }): Promise<Album[]> {
            const parsedDate = YearMonth.parse(date);
            const start = parsedDate.atDay(1).toString();
            const end = parsedDate.atEndOfMonth().toString();

            return Album.query()
                .select("albums.*")
                .innerJoin("releases", "albums.id", "releases.album_id")
                .whereBetween("releases.released_on", [start, end])
                .orderBy("releases.released_on");
        },

        async artist(_root: any, { id }: { id: string }): Promise<Artist | null> {
            const artist = await Artist.query().findById(id);
            return artist || null;
        },

        artists(_root: any, { query, limit }: { query: string, limit: number }): Promise<Artist[]> {
            let builder = Artist.search(query) as QueryBuilder<Artist>;

            if (limit) {
                builder = builder.limit(limit);
            }

            return builder;
        },

        artistsByStartMonth(_root: any, { date }: { date: string }): Promise<Artist[]> {
            const parsedDate = YearMonth.parse(date);
            const month = parsedDate.month().value();

            return Artist.query()
                .where("started_on_month", "=", month)
                .where("kind", "=", ArtistKind.Person)
                .orderBy("started_on_day");
        },

        recentAlbums(_root: any, { first }: { first: number }): Promise<Album[]> {
            return Album.query()
                .select("albums.*")
                .innerJoin("releases", "albums.id", "releases.album_id")
                .orderBy("releases.released_on", "desc")
                .groupBy("albums.id", "releases.released_on")
                .limit(first);
        },

        async release(_root: any, { id }: { id: string }): Promise<Release | null> {
            const release = await Release.query().findById(id);
            return release || null;
        },

        async song(_root: any, { id }: { id: string }): Promise<Song | null> {
            const song = await Song.query().findById(id);
            return song || null;
        },

        songs(_root: any, { query }: { query: string }): Promise<Song[]> {
            return Song.search(query);
        },
    },
};
