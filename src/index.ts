import { ExpressGraphQLOptionsFunction, graphqlExpress } from "apollo-server-express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as express from "express";
import * as Knex from "knex";
import * as morgan from "morgan";
import { Model } from "objection";

import schema from "./schema";

dotenv.config();

const PORT = process.env.PORT || 3000;

const knex = Knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
});

Model.knex(knex);

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
