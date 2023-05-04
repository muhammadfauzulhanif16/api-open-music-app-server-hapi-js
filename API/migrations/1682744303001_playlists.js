exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'CHAR(36)',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    owner: {
      type: 'CHAR(36)',
      notNull: true
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

  pgm.addConstraint(
    'playlists',
    'fk_playlists.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}
exports.down = (pgm) => pgm.dropTable('playlists')
