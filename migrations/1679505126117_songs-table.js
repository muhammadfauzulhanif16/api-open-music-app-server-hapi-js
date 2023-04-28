exports.up = (pgm) => {
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
    album_id: {
      type: 'CHAR(36)',
      references: 'albums(id)'
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

  pgm.createConstraint(
    'songs',
    'fk_songs.album_id_albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => pgm.dropTable('songs')
