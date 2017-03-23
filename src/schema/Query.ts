import * as moment from "moment";

import Album from "../models/Album";
import Artist, { ArtistKind } from "../models/Artist";
import Release from "../models/Release";

export const typeDefs = `
    type Query {
        albums(query: String!): [Album!]!
        albumsByReleaseMonth(date: String!): [Album!]!
        artist(id: ID!): Artist
        artists(query: String!): [Artist!]!
        artistsByStartMonth(date: String!): [Artist!]!
        recentAlbums(first: Int = 8): [Album!]!
        release(id: ID!): Release
    }
`;

export const resolvers = {
    Query: {
        async albums(root: any, { query }: { query: string }): Promise<Album[]> {
            try {
                return await Album.search(query);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async albumsByReleaseMonth(root: any, { date }: { date: string }): Promise<Album[]> {
            const parsedDate = moment(date, "YYYY-MM");
            const start = parsedDate.startOf("month").format("YYYY-MM-DD");
            const end = parsedDate.endOf("month").format("YYYY-MM-DD");

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

        async artist(root: any, { id }: { id: string }): Promise<Artist | null> {
            try {
                const artist = await Artist.query().findById(id);
                return artist || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artists(root: any, { query }: { query: string }): Promise<Artist[]> {
            try {
                return await Artist.search(query);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async artistsByStartMonth(root: any, { date }: { date: string }): Promise<Artist[]> {
            const parsedDate = moment(date, "YYYY-MM");

            // moment.month() is zero-based.
            const month = parsedDate.month() + 1;

            try {
                return await Artist.query()
                    .where("started_on_month", "=", month)
                    .where("kind", "=", ArtistKind.Person);
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async recentAlbums(root: any, { first }: { first: number }): Promise<Album[]> {
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

        async release(root: any, { id }: { id: string }): Promise<Release | null> {
            try {
                const release = await Release.query().findById(id);
                return release || null;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
