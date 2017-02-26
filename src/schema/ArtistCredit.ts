import ArtistCredit from "../models/ArtistCredit";
import ArtistCreditName from "../models/ArtistCreditName";

export const typeDefs = `
    type ArtistCredit {
        id: ID!
        names: [ArtistCreditName!]!
    }
`;

export const resolvers = {
    ArtistCredit: {
        async names(artistCredit: ArtistCredit): Promise<ArtistCreditName[]> {
            try {
                const ac = await artistCredit.$loadRelated("names");
                return ac.names || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
