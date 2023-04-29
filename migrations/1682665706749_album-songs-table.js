exports.up = (pgm) => {
  pgm.createTable('album_songs', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true
    },
    album_id: {
      type: 'CHAR(36)',
      notNull: true
    },
    song_id: {
      type: 'CHAR(36)',
      notNull: true
    }
  })

  pgm.addConstraint(
    'album_songs',
    'unique_album_id_and_song_id',
    'UNIQUE(album_id, song_id)'
  )
  pgm.addConstraint(
    'album_songs',
    'fk_album_songs.album_id_albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(
    'album_songs',
    'fk_album_songs.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => pgm.dropTable('album_songs')
