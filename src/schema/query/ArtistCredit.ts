import ArtistCredit from "../../models/ArtistCredit";
import ArtistCreditName from "../../models/ArtistCreditName";

export const typeDefs = `
    type ArtistCredit {
        id: ID!
        names: [ArtistCreditName!]!
    }
`;

export const resolvers = {
    ArtistCredit: {
        async names(artistCredit: ArtistCredit): Promise<ArtistCreditName[]> {
            const ac = await artistCredit.$loadRelated("names");
            return ac.names || [];
        },
    },
};
