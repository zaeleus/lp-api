import Medium from "../models/Medium";
import Track from "../models/Track";


export const typeDefs = `
    enum MediumKind {
        CD
        DVD
        BLU_RAY
        DIGITAL
        VINYL
    }

    type Medium {
        id: ID!
        kind: MediumKind!
        position: Int!
        name: String
        tracks: [Track!]!
    }
`;

export const resolvers = {
    Medium: {
        kind(medium: Medium): string {
            switch (medium.kind) {
                case 0: return "CD";
                case 1: return "DVD";
                case 2: return "BLU_RAY";
                case 3: return "DIGITAL";
                case 4: return "VINYL";
                default: throw new Error("invalid medium kind");
            }
        },

        async tracks(medium: Medium): Promise<Track[]> {
            try {
                const m = await medium.$loadRelated("tracks");
                return m.tracks || [];
            } catch (err) {
                throw new Error(err.message);
            }
        },
    },
};
