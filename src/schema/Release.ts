import * as moment from "moment";

import Album from "../models/Album";
import Medium from "../models/Medium";
import Release from "../models/Release";
import ReleaseUrl from "../models/ReleaseUrl";

export const typeDefs = `
    type Release {
        id: ID!
        releasedOn: String!
        country: String
        catalogNumber: String
        disambiguation: String
        artworkUrl: String!
        album: Album!
        media: [Medium!]!
        urls: [ReleaseUrl!]!
    }
`;

export const resolvers = {
    Release: {
        async album(release: Release): Promise<Album> {
            try {
                const r = await release.$loadRelated("album");

                if (!r.album) {
                    throw new Error("failed to load release.album");
                }

                return r.album;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        artworkUrl(release: Release): string {
            return `/store/${release.id}.jpg`;
        },

        async media(release: Release): Promise<Medium[]> {
            try {
                const r = await release.$loadRelated("media(orderByPosition)", {
                    orderByPosition: (builder) => builder.orderBy("media.position"),
                });

                return r.media || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        releasedOn(release: Release): string {
            return moment(release.releasedOn).format("YYYY-MM-DD");
        },

        async urls(release: Release): Promise<ReleaseUrl[]> {
            try {
                const r = await release.$loadRelated("urls");
                return r.urls || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
