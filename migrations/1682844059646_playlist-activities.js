exports.up = (pgm) => {
  pgm.createTable('playlist_activities', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
      notNull: true
    },
    playlist_id: {
      type: 'CHAR(36)',
      notNull: true
    },
    user_id: {
      type: 'CHAR(36)',
      notNull: true
    },
    song_id: {
      type: 'CHAR(36)',
      notNull: true
    },
    action: {
      type: 'TEXT',
      notNull: true
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true
    }
  })

  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(
    'playlist_activities',
    'fk_playlist_activities.song_id_songs.id',
    'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => pgm.dropTable('playlist_activities')
