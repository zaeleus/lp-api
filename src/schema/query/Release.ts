import { LocalDate, nativeJs } from "js-joda";

import Album from "../../models/Album";
import Medium from "../../models/Medium";
import Release from "../../models/Release";
import ReleaseUrl from "../../models/ReleaseUrl";

export const typeDefs = `
    type ArtworkUrls {
        original: String!
        thumbnail: String!
    }

    type Release {
        id: ID!
        releasedOn: String!
        country: String
        catalogNumber: String
        disambiguation: String
        artworkUrls: ArtworkUrls!
        album: Album!
        media: [Medium!]!
        siblings: [Release]!
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

        artworkUrls(release: Release): any {
            if (!release.artworkData) {
                throw new Error("missing artwork data");
            }

            const data = JSON.parse(release.artworkData);

            return {
                original: `${process.env.STORE_HOST}/store/${data.original.id}.jpg`,
                thumbnail: `${process.env.STORE_HOST}/store/${data.thumbnail.id}.jpg`,
            };
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
            return LocalDate.from(nativeJs(release.releasedOn)).toString();
        },

        async siblings(release: Release): Promise<Release[]> {
            try {
                return await release.siblings();
            } catch (err) {
                throw new Error(err.message);
            }
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
