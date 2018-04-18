import Artist from "../../models/Artist";
import ArtistCreditName from "../../models/ArtistCreditName";

export const typeDefs = `
    type ArtistCreditName {
        id: ID!
        artist: Artist!
        position: Int!
        name: String!
        locale: String!
        isDefault: Boolean!
        isOriginal: Boolean!
        separator: String!
    }
`;

export const resolvers = {
    ArtistCreditName: {
        async artist(name: ArtistCreditName): Promise<Artist> {
            const n = await name.$loadRelated("artist");

            if (!n.artist) {
                throw new Error("failed to load membership.artist");
            }

            return n.artist;
        },
    },
};
