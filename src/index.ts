import { ExpressGraphQLOptionsFunction, graphqlExpress } from "apollo-server-express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import knex from "knex";
import morgan from "morgan";
import { Model } from "objection";

import schema from "./schema";

dotenv.config();

const PORT = process.env.PORT || 3000;

const knx = knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
});

Model.knex(knx);

const graphqlOptions: ExpressGraphQLOptionsFunction = (request) => ({
    context: { request, knex },
    schema,
});

const app = express();

app.use(morgan("dev"));
app.use("/graphql", bodyParser.json(), graphqlExpress(graphqlOptions));

app.use(express.static("public"));

// tslint:disable-next-line:no-console
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
