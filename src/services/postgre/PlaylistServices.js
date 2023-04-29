const { Pool } = require('pg')
const uuid = require('uuid')
const { InvariantError } = require('../../exceptions')
// const { mapDBToPlaylistModel } = require('../../utils')

exports.PlaylistServices = () => {
  const pool = new Pool()

  const addPlaylist = async ({ name, owner }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, owner, createdAt, createdAt]
    )

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }
  }

  return {
    addPlaylist
  }
}
