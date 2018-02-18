import * as dotenv from "dotenv";
import * as Knex from "knex";
import { Model } from "objection";

let knex: Knex;

beforeAll(() => {
    dotenv.config();

    knex = Knex({
        client: "pg",
        connection: process.env.DATABASE_URL,
    });

    Model.knex(knex);
});

afterAll(() => {
    if (knex) {
        knex.destroy();
    }
});
