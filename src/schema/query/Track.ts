import ArtistCredit from "../../models/ArtistCredit";
import Song from "../../models/Song";
import Track from "../../models/Track";
import TrackName from "../../models/TrackName";

export const typeDefs = `
    type Track {
        id: ID!
        position: Int!
        duration: Int
        artistCredit: ArtistCredit!
        song: Song!
        names: [TrackName!]!
    }
`;

export const resolvers = {
    Track: {
        async artistCredit(track: Track): Promise<ArtistCredit> {
            const t = await track.$loadRelated("artistCredit");

            if (!t.artistCredit) {
                throw new Error("failed to load track.artistCredit");
            }

            return t.artistCredit;
        },

        async names(track: Track): Promise<TrackName[]> {
            const t = await track.$loadRelated("names");
            return t.names || [];
        },

        async song(track: Track): Promise<Song> {
            const t = await track.$loadRelated("song");

            if (!t.song) {
                throw new Error("failed to load track.song");
            }

            return t.song;
        },
    },
};
