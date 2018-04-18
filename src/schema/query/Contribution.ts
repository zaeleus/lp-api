import ArtistCredit from "../../models/ArtistCredit";
import Contribution from "../../models/Contribution";
import Song from "../../models/Song";

export const typeDefs = `
    enum ContributionKind {
        PERFORMER
        ARRANGER
        COMPOSER
        LYRICIST
    }

    type Contribution {
        id: ID!
        artistCredit: ArtistCredit!
        song: Song!
        kind: ContributionKind!
    }
`;

export const resolvers = {
    Contribution: {
        async artistCredit(contribution: Contribution): Promise<ArtistCredit> {
            const c = await contribution.$loadRelated("artistCredit");

            if (!c.artistCredit) {
                throw new Error("failed to load contribution.artistCredit");
            }

            return c.artistCredit;
        },

        kind(contribution: Contribution): string {
            switch (contribution.kind) {
                case 0: return "PERFORMER";
                case 1: return "ARRANGER";
                case 2: return "COMPOSER";
                case 3: return "LYRICIST";
                default: throw new Error("invalid contribution kind");
            }
        },

        async song(contribution: Contribution): Promise<Song> {
            const c = await contribution.$loadRelated("song");

            if (!c.song) {
                throw new Error("failed to load contribution.song");
            }

            return c.song;
        },
    },
};
