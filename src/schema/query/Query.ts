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
        async albums(_root: any, { query }: { query: string }): Promise<Album[]> {
            try {
                return await Album.search(query);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async albumsByReleaseMonth(_root: any, { date }: { date: string }): Promise<Album[]> {
            const parsedDate = YearMonth.parse(date);
            const start = parsedDate.atDay(1).toString();
            const end = parsedDate.atEndOfMonth().toString();

            try {
                return await Album.query()
                    .select("albums.*")
                    .innerJoin("releases", "albums.id", "releases.album_id")
                    .whereBetween("releases.released_on", [start, end])
                    .orderBy("releases.released_on");
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artist(_root: any, { id }: { id: string }): Promise<Artist | null> {
            try {
                const artist = await Artist.query().findById(id);
                return artist || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artists(_root: any, { query, limit }: { query: string, limit: number }): Promise<Artist[]> {
            try {
                let builder = Artist.search(query) as QueryBuilder<Artist>;

                if (limit) {
                    builder = builder.limit(limit);
                }

                return await builder;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artistsByStartMonth(_root: any, { date }: { date: string }): Promise<Artist[]> {
            const parsedDate = YearMonth.parse(date);
            const month = parsedDate.month().value();

            try {
                return await Artist.query()
                    .where("started_on_month", "=", month)
                    .where("kind", "=", ArtistKind.Person)
                    .orderBy("started_on_day");
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async recentAlbums(_root: any, { first }: { first: number }): Promise<Album[]> {
            try {
                return await Album.query()
                    .select("albums.*")
                    .innerJoin("releases", "albums.id", "releases.album_id")
                    .orderBy("releases.released_on", "desc")
                    .groupBy("albums.id", "releases.released_on")
                    .limit(first);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async release(_root: any, { id }: { id: string }): Promise<Release | null> {
            try {
                const release = await Release.query().findById(id);
                return release || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async song(_root: any, { id }: { id: string }): Promise<Song | undefined> {
            return Song.query().findById(id);
        },

        async songs(_root: any, { query }: { query: string }): Promise<Song[]> {
            try {
                return await Song.search(query);
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
