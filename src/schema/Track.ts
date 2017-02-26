import ArtistCredit from "../models/ArtistCredit";
import Song from "../models/Song";
import Track from "../models/Track";
import TrackName from "../models/TrackName";

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
            try {
                const t = await track.$loadRelated("artistCredit");

                if (!t.artistCredit) {
                    throw new Error("failed to load track.artistCredit");
                }

                return t.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async names(track: Track): Promise<TrackName[]> {
            try {
                const t = await track.$loadRelated("names");
                return t.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async song(track: Track): Promise<Song> {
            try {
                const t = await track.$loadRelated("song");

                if (!t.song) {
                    throw new Error("failed to load track.song");
                }

                return t.song;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
