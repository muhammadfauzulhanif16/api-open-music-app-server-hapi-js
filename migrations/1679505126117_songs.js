exports.up = (pgm) =>
  pgm.createTable('songs', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
      notNull: true
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'SMALLSERIAL',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    duration: {
      type: 'SMALLINT'
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    }
  })

exports.down = (pgm) => pgm.dropTable('songs')
