import Album from "../../models/Album";
import AlbumName from "../../models/AlbumName";
import ArtistCredit from "../../models/ArtistCredit";
import Release from "../../models/Release";

export const typeDefs = `
    enum AlbumKind {
        SINGLE
        EP
        LP
    }

    type Album {
        id: ID!
        kind: AlbumKind!
        artistCredit: ArtistCredit!
        names: [AlbumName!]!
        releases: [Release!]!
        defaultRelease: Release!
    }
`;

export const resolvers = {
    Album: {
        async artistCredit(album: Album): Promise<ArtistCredit> {
            const a = await album.$loadRelated("artistCredit");

            if (!a.artistCredit) {
                throw new Error("failed to load album.artistCredit");
            }

            return a.artistCredit;
        },

        kind(album: Album): string {
            switch (album.kind) {
                case 0: return "SINGLE";
                case 1: return "EP";
                case 2: return "LP";
                default: throw new Error("invalid album kind");
            }
        },

        async names(album: Album): Promise<AlbumName[]> {
            const a = await album.$loadRelated("names");
            return a.names || [];
        },

        async releases(album: Album): Promise<Release[]> {
            const a = await album.$loadRelated("releases");
            return a.releases || [];
        },

        async defaultRelease(album: Album): Promise<Release> {
            const a = await album.$loadRelated("releases");

            if (!a.releases) {
                throw new Error("missing default release");
            }

            return a.releases[0];
        },
    },
};
