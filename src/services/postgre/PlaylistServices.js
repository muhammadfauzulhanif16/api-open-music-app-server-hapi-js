const { Pool } = require('pg')
const uuid = require('uuid')
const {
  InvariantError,
  NotFoundError,
  AuthorizationError
} = require('../../exceptions')
const {
  mapDBToPlaylistsModel,
  mapDBToSongsModel,
  mapDBToPlaylistModel
} = require('../../utils')

exports.PlaylistServices = () => {
  const pool = new Pool()

  const addPlaylist = async (name, owner) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, owner, createdAt, createdAt]
    )

    if (!result.rows[0].id) {
      throw new InvariantError('Daftar putar gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const verifyPlaylistOwner = async (playlistId, userId) => {
    const result = await pool.query('SELECT * FROM playlists WHERE id = $1', [
      playlistId
    ])

    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar tidak ditemukan')
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses sumber ini')
    }
  }

  const addSongToPlaylist = async (playlistId, songId) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      [id, playlistId, songId]
    )

    await editPlaylist(playlistId, createdAt)

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke daftar putar')
    }
  }

  const verifySongOnPlaylist = async (songId) => {
    const result = await pool.query(
      'SELECT * FROM playlist_songs WHERE song_id = $1',
      [songId]
    )

    if (result.rowCount) {
      throw new InvariantError('Lagu sudah ada di daftar putar')
    }
  }

  const getPlaylist = async (id) => {
    const result = await pool.query(
      'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal ditampilkan karena tidak ditemukan'
      )
    }

    const songs = await getSongsFromPlaylist(id)

    return mapDBToPlaylistModel(result.rows[0], songs)
  }

  const getPlaylists = async (owner) => {
    const result = await pool.query(
      'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.owner = $1',
      [owner]
    )

    return result.rows.map(mapDBToPlaylistsModel)
  }

  const getSongsFromPlaylist = async (playlistId) => {
    const result = await pool.query(
      'SELECT songs.* FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      [playlistId]
    )

    return result.rows.map(mapDBToSongsModel)
  }

  const editPlaylist = async (id, updatedAt) => {
    const result = await pool.query(
      'UPDATE playlists SET updated_at = $1 WHERE id = $2 RETURNING id',
      [updatedAt, id]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal diperbarui karena tidak ditemukan'
      )
    }
  }

  const deletePlaylist = async (id) => {
    const result = await pool.query('DELETE FROM playlists WHERE id = $1', [id])

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal dihapus karena tidak ditemukan'
      )
    }
  }

  const deleteSongFromPlaylist = async (playlistId, songId) => {
    const result = await pool.query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Lagu gagal dihapus dari daftar putar karena tidak ditemukan'
      )
    }
  }

  return {
    addPlaylist,
    verifyPlaylistOwner,
    addSongToPlaylist,
    verifySongOnPlaylist,
    getPlaylist,
    getPlaylists,
    getSongsFromPlaylist,
    editPlaylist,
    deletePlaylist,
    deleteSongFromPlaylist
  }
}
