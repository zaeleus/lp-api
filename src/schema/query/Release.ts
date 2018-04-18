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
            const r = await release.$loadRelated("album");

            if (!r.album) {
                throw new Error("failed to load release.album");
            }

            return r.album;
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
            const r = await release.$loadRelated("media(orderByPosition)", {
                orderByPosition: (builder) => builder.orderBy("media.position"),
            });

            return r.media || [];
        },

        releasedOn(release: Release): string {
            return LocalDate.from(nativeJs(release.releasedOn)).toString();
        },

        siblings(release: Release): Promise<Release[]> {
            return release.siblings();
        },

        async urls(release: Release): Promise<ReleaseUrl[]> {
            const r = await release.$loadRelated("urls");
            return r.urls || [];
        },
    },
};
