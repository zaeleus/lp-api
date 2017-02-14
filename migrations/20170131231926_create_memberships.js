exports.up = knex => (
  knex.schema.raw(`
    CREATE TABLE memberships (
      id serial PRIMARY KEY,
      group_id integer NOT NULL,
      artist_credit_id integer NOT NULL,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL
    );

    CREATE INDEX ON memberships (group_id);

    ALTER TABLE ONLY memberships
    ADD FOREIGN KEY (group_id)
    REFERENCES artists (id)
    ON DELETE CASCADE;

    CREATE INDEX ON memberships (artist_credit_id);

    ALTER TABLE ONLY memberships
    ADD FOREIGN KEY (artist_credit_id)
    REFERENCES artist_credits (id)
    ON DELETE CASCADE;
  `)
);

exports.down = knex => knex.schema.dropTable('memberships');
