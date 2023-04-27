exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
      notNull: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
      type: 'SMALLSERIAL',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
    },
  })
}

exports.down = (pgm) => pgm.dropTable('albums')
