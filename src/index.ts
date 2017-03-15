import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as express from "express";
import { Request } from "express";
import { graphiqlExpress, graphqlExpress } from "graphql-server-express";
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

const graphqlOptions = (request: Request) => ({
    schema,
    context: { request, knex },
});

const app = express();

app.use(morgan("dev"));
app.use("/graphql", bodyParser.json(), graphqlExpress(graphqlOptions));
app.use("/graphiql", graphiqlExpress({ endpointURL: "/graphql" }));

app.use(express.static("public"));

// tslint:disable-next-line:no-console
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
