exports.up = (pgm) =>
  pgm.createTable('album_likes', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
      notNull: true
    },
    album_id: {
      type: 'CHAR(36)',
      notNull: true
    },
    user_id: {
      type: 'CHAR(36)',
      notNull: true
    }
  })

exports.down = (pgm) => {}
