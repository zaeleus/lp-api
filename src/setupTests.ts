import * as dotenv from "dotenv";
import * as Knex from "knex";
import { Model } from "objection";

dotenv.config();

const knex = Knex({
    client: "pg",
    connection: process.env.DATABASE_URL,
});

Model.knex(knex);

afterAll(() => knex.destroy());
