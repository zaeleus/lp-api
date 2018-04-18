import ArtistCredit from "../../models/ArtistCredit";
import Contribution from "../../models/Contribution";
import Release from "../../models/Release";
import Song from "../../models/Song";
import SongName from "../../models/SongName";
import SongUrl from "../../models/SongUrl";

export const typeDefs = `
    type Song {
        id: ID!
        appearsOn: [Release]!
        artistCredit: ArtistCredit!
        contributions: [Contribution!]!
        names: [SongName!]!
        urls: [SongUrl!]!
    }
`;

export const resolvers = {
    Song: {
        appearsOn(song: Song): Promise<Release[]> {
            return Release.query()
                .select("releases.*")
                .innerJoin("media", "releases.id", "media.release_id")
                .innerJoin("tracks", "media.id", "tracks.medium_id")
                .innerJoin("songs", "tracks.song_id", "songs.id")
                .where("songs.id", song.id);
        },

        async artistCredit(song: Song): Promise<ArtistCredit> {
            const s = await song.$loadRelated("artistCredit");

            if (!s.artistCredit) {
                throw new Error("failed to load song.artistCredit");
            }

            return s.artistCredit;
        },

        async contributions(song: Song): Promise<Contribution[]> {
            const s = await song.$loadRelated("contributions");
            return s.contributions || [];
        },

        async names(song: Song): Promise<SongName[]> {
            const s = await song.$loadRelated("names");
            return s.names || [];
        },

        async urls(song: Song): Promise<SongUrl[]> {
            const s = await song.$loadRelated("urls");
            return s.urls || [];
        },
    },
};
