import dotenv from "dotenv";
import knex from "knex";
import { Model } from "objection";

let knx: knex;

beforeAll(() => {
    dotenv.config();

    knx = knex({
        client: "pg",
        connection: `${process.env.DATABASE_URL}_test`,
    });

    Model.knex(knx);
});

afterAll(() => {
    if (knx) {
        knx.destroy();
    }
});
