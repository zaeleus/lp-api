import { makeExecutableSchema } from "graphql-tools";

import { resolvers as albumResolvers, typeDefs as albumTypeDefs } from "./Album";
import { resolvers as albumNameResolvers, typeDefs as albumNameTypeDefs } from "./AlbumName";
import { resolvers as artistResolvers, typeDefs as artistTypeDefs } from "./Artist";
import { resolvers as artistCreditResolvers, typeDefs as artistCreditTypeDefs } from "./ArtistCredit";
import { resolvers as artistCreditNameResolvers, typeDefs as artistCreditNameTypeDefs } from "./ArtistCreditName";
import { resolvers as artistNameResolvers, typeDefs as artistNameTypeDefs } from "./ArtistName";
import { resolvers as artistUrlResolvers, typeDefs as artistUrlTypeDefs } from "./ArtistUrl";
import { resolvers as contributionResolvers, typeDefs as contributionTypeDefs } from "./Contribution";
import { resolvers as mediumResolvers, typeDefs as mediumTypeDefs } from "./Medium";
import { resolvers as membershipResolvers, typeDefs as membershipTypeDefs } from "./Membership";
import { resolvers as mutationResolvers, typeDefs as mutationTypeDefs } from "./Mutation";
import { resolvers as queryResolvers, typeDefs as queryTypeDefs } from "./Query";
import { resolvers as releaseResolvers, typeDefs as releaseTypeDefs } from "./Release";
import { resolvers as releaseUrlResolvers, typeDefs as releaseUrlTypeDefs } from "./ReleaseUrl";
import { resolvers as songResolvers, typeDefs as songTypeDefs } from "./Song";
import { resolvers as songNameResolvers, typeDefs as songNameTypeDefs } from "./SongName";
import { resolvers as songUrlResolvers, typeDefs as songUrlTypeDefs } from "./SongUrl";
import { resolvers as trackResolvers, typeDefs as trackTypeDefs } from "./Track";
import { resolvers as trackNameResolvers, typeDefs as trackNameTypeDefs } from "./TrackName";

const typeDefs = [
    albumTypeDefs,
    albumNameTypeDefs,
    artistTypeDefs,
    artistCreditTypeDefs,
    artistCreditNameTypeDefs,
    artistNameTypeDefs,
    artistUrlTypeDefs,
    contributionTypeDefs,
    mediumTypeDefs,
    membershipTypeDefs,
    mutationTypeDefs,
    queryTypeDefs,
    releaseTypeDefs,
    releaseUrlTypeDefs,
    songTypeDefs,
    songNameTypeDefs,
    songUrlTypeDefs,
    trackTypeDefs,
    trackNameTypeDefs,
];

const resolvers = {
    ...albumResolvers,
    ...albumNameResolvers,
    ...artistResolvers,
    ...artistCreditResolvers,
    ...artistCreditNameResolvers,
    ...artistNameResolvers,
    ...artistUrlResolvers,
    ...contributionResolvers,
    ...mediumResolvers,
    ...membershipResolvers,
    ...mutationResolvers,
    ...queryResolvers,
    ...releaseResolvers,
    ...releaseUrlResolvers,
    ...songResolvers,
    ...songNameResolvers,
    ...songUrlResolvers,
    ...trackResolvers,
    ...trackNameResolvers,
};

export default makeExecutableSchema({ typeDefs, resolvers });
