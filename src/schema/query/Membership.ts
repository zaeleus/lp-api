import Artist from "../../models/Artist";
import ArtistCredit from "../../models/ArtistCredit";
import Membership from "../../models/Membership";

import PartialDate from "../../util/PartialDate";

export const typeDefs = `
    type Membership {
        id: ID!
        group: Artist!
        artistCredit: ArtistCredit!
        startedOn: String
        endedOn: String
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

        endedOn(membership: Membership): string | null {
            const date = new PartialDate(
                membership.ended_on_year,
                membership.ended_on_month,
                membership.ended_on_day,
            ).toString();

            return (date !== "") ? date : null;
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

        startedOn(membership: Membership): string | null {
            const date = new PartialDate(
                membership.started_on_year,
                membership.started_on_month,
                membership.started_on_day,
            ).toString();

            return (date !== "") ? date : null;
        },
    },
};
