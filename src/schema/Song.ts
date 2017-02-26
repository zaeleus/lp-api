import ArtistCredit from "../models/ArtistCredit";
import Contribution from "../models/Contribution";
import Song from "../models/Song";
import SongName from "../models/SongName";
import SongUrl from "../models/SongUrl";

export const typeDefs = `
    type Song {
        id: ID!
        artistCredit: ArtistCredit!
        contributions: [Contribution!]!
        names: [SongName!]!
        urls: [SongUrl!]!
    }
`;

export const resolvers = {
    Song: {
        async artistCredit(song: Song): Promise<ArtistCredit> {
            try {
                const s = await song.$loadRelated("artistCredit");

                if (!s.artistCredit) {
                    throw new Error("failed to load song.artistCredit");
                }

                return s.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async contributions(song: Song): Promise<Contribution[]> {
            try {
                const s = await song.$loadRelated("contributions");
                return s.contributions || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async names(song: Song): Promise<SongName[]> {
            try {
                const s = await song.$loadRelated("names");
                return s.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async urls(song: Song): Promise<SongUrl[]> {
            try {
                const s = await song.$loadRelated("urls");
                return s.urls || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
