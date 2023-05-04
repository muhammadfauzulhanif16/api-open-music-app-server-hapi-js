const uuid = require('uuid')
const { Pool } = require('pg')
const {
  InvariantError,
  NotFoundError,
  AuthorizationError
} = require('../../exceptions')
const {
  mapDBToSongsModel,
  mapDBToActivitiesModel,
  mapDBToPlaylistModel
} = require('../../utils')

exports.PlaylistServices = (collaborationServices) => {
  const addPlaylist = async (name, owner) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await new Pool().query(
      'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, owner, createdAt, createdAt]
    )

    if (!result.rows[0].id) {
      throw new InvariantError('Daftar putar gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const verifyOwner = async (playlistId, userId) => {
    const result = await new Pool().query(
      'SELECT * FROM playlists WHERE id = $1',
      [playlistId]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar tidak ditemukan')
    }

    if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('Anda tidak berhak mengakses sumber ini')
    }
  }

  const verifyPlaylist = async (playlistId) => {
    const result = await new Pool().query(
      'SELECT * FROM playlists WHERE id = $1',
      [playlistId]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Daftar putar tidak ditemukan')
    }

    return result.rows[0].id
  }

  const addSong = async (playlistId, userId, songId) => {
    const id = uuid.v4()
    const time = new Date()

    const result = await new Pool().query(
      'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      [id, playlistId, songId]
    )

    await editPlaylist(playlistId, time)
    await addActivity(playlistId, userId, songId, 'add', time)

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke daftar putar')
    }
  }

  const verifySong = async (songId) => {
    const result = await new Pool().query(
      'SELECT * FROM playlist_songs WHERE song_id = $1',
      [songId]
    )

    if (result.rowCount) {
      throw new InvariantError('Lagu sudah ada di daftar putar')
    }
  }

  const addActivity = async (playlistId, userId, songId, action, createdAt) => {
    const id = uuid.v4()

    const result = await new Pool().query(
      'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6)',
      [id, playlistId, userId, songId, action, createdAt]
    )

    if (!result.rowCount) {
      throw new InvariantError('Aktivitas gagal ditambahkan')
    }
  }

  const getPlaylist = async (id) => {
    const result = await new Pool().query(
      'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal ditampilkan. Daftar putar tidak ditemukan'
      )
    }

    return mapDBToPlaylistModel(result.rows[0])
  }

  const getPlaylists = async (owner) => {
    const result = await new Pool().query(
      'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id WHERE playlists.owner = $1 OR collaborations.user_id = $1',
      [owner]
    )

    return result.rows.map(mapDBToPlaylistModel)
  }

  const getSongs = async (playlistId) => {
    const result = await new Pool().query(
      'SELECT songs.* FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      [playlistId]
    )

    return result.rows.map(mapDBToSongsModel)
  }

  const getActivities = async (playlistId) => {
    const result = await new Pool().query(
      'SELECT playlist_activities.*, users.username, songs.title FROM playlist_activities LEFT JOIN users ON playlist_activities.user_id = users.id LEFT JOIN songs ON playlist_activities.song_id = songs.id WHERE playlist_activities.playlist_id = $1',
      [playlistId]
    )

    if (!result.rowCount) {
      throw new InvariantError(
        'Aktivitas gagal ditampilkan. Daftar putar tidak ditemukan'
      )
    }

    return result.rows.map(mapDBToActivitiesModel)
  }

  const editPlaylist = async (id, updatedAt) => {
    const result = await new Pool().query(
      'UPDATE playlists SET updated_at = $1 WHERE id = $2 RETURNING id',
      [updatedAt, id]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal diperbarui. Daftar putar tidak ditemukan'
      )
    }
  }

  const deleteSong = async (playlistId, songId, userId) => {
    const time = new Date()

    const result = await new Pool().query(
      'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      [playlistId, songId]
    )

    await editPlaylist(playlistId, time)
    await addActivity(playlistId, userId, songId, 'delete', time)

    if (!result.rowCount) {
      throw new NotFoundError(
        'Lagu gagal dihapus dari daftar putar. Lagu tidak ditemukan'
      )
    }
  }

  const deletePlaylist = async (id) => {
    const result = await new Pool().query(
      'DELETE FROM playlists WHERE id = $1',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError(
        'Daftar putar gagal dihapus. Daftar putar tidak ditemukan'
      )
    }
  }

  const verifyAccess = async (playlistId, userId) => {
    try {
      await verifyOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) throw error

      try {
        await collaborationServices.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  return {
    addPlaylist,
    verifyOwner,
    verifyPlaylist,
    addSong,
    verifySong,
    addActivity,
    getPlaylist,
    getPlaylists,
    getSongs,
    getActivities,
    editPlaylist,
    deleteSong,
    deletePlaylist,
    verifyAccess
  }
}
