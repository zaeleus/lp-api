import Artist from "../models/Artist";
import ArtistCredit from "../models/ArtistCredit";
import Membership from "../models/Membership";

export const typeDefs = `
    type Membership {
        id: ID!
        group: Artist!
        artistCredit: ArtistCredit!
    }
`;

export const resolvers = {
    Membership: {
        async artistCredit(membership: Membership): Promise<ArtistCredit> {
            try {
                const m = await membership.$loadRelated("artistCredit");

                if (!m.artistCredit) {
                    throw new Error("failed to load membership.artistCredit");
                }

                return m.artistCredit;
            } catch (err) {
                throw new Error(err.message);
            }
        },

        async group(membership: Membership): Promise<Artist> {
            try {
                const m = await membership.$loadRelated("group");

                if (!m.group) {
                    throw new Error("failed to load membership.artist");
                }

                return m.group;
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
