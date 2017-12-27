import { makeExecutableSchema } from "graphql-tools";

import { resolvers as mutationResolvers, typeDefs as mutationTypeDefs } from "./mutation/Mutation";

import { resolvers as albumResolvers, typeDefs as albumTypeDefs } from "./query/Album";
import { resolvers as albumNameResolvers, typeDefs as albumNameTypeDefs } from "./query/AlbumName";
import { resolvers as artistResolvers, typeDefs as artistTypeDefs } from "./query/Artist";
import { resolvers as artistCreditResolvers, typeDefs as artistCreditTypeDefs } from "./query/ArtistCredit";
import { resolvers as artistCreditNameResolvers, typeDefs as artistCreditNameTypeDefs } from "./query/ArtistCreditName";
import { resolvers as artistNameResolvers, typeDefs as artistNameTypeDefs } from "./query/ArtistName";
import { resolvers as artistUrlResolvers, typeDefs as artistUrlTypeDefs } from "./query/ArtistUrl";
import { resolvers as contributionResolvers, typeDefs as contributionTypeDefs } from "./query/Contribution";
import { resolvers as mediumResolvers, typeDefs as mediumTypeDefs } from "./query/Medium";
import { resolvers as membershipResolvers, typeDefs as membershipTypeDefs } from "./query/Membership";
import { resolvers as queryResolvers, typeDefs as queryTypeDefs } from "./query/Query";
import { resolvers as releaseResolvers, typeDefs as releaseTypeDefs } from "./query/Release";
import { resolvers as releaseUrlResolvers, typeDefs as releaseUrlTypeDefs } from "./query/ReleaseUrl";
import { resolvers as songResolvers, typeDefs as songTypeDefs } from "./query/Song";
import { resolvers as songNameResolvers, typeDefs as songNameTypeDefs } from "./query/SongName";
import { resolvers as songUrlResolvers, typeDefs as songUrlTypeDefs } from "./query/SongUrl";
import { resolvers as trackResolvers, typeDefs as trackTypeDefs } from "./query/Track";
import { resolvers as trackNameResolvers, typeDefs as trackNameTypeDefs } from "./query/TrackName";

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
