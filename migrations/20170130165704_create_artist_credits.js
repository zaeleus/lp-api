exports.up = knex => (
  knex.schema.raw(`
    CREATE TABLE artist_credits (
      id serial PRIMARY KEY,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL
    );
  `)
);

exports.down = knex => knex.schema.dropTable('artist_credits');
