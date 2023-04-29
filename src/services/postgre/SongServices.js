require('dotenv').config()
const { Pool } = require('pg')
const uuid = require('uuid')
const { InvariantError, NotFoundError } = require('../../exceptions')
const { mapDBToSongsModel, mapDBToSongModel } = require('../../utils')

exports.SongServices = () => {
  const pool = new Pool()

  const addSong = async ({
    title,
    year,
    performer,
    genre,
    duration,
    albumId
  }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [id, title, year, performer, genre, duration, createdAt, createdAt]
    )

    if (!result.rows[0].id) throw new InvariantError('Lagu gagal ditambahkan')

    if (albumId) await addSongToAlbum(albumId, id)

    return result.rows[0].id
  }

  const addSongToAlbum = async (albumId, songId) => {
    const id = uuid.v4()

    const result = await pool.query(
      'INSERT INTO album_songs VALUES($1, $2, $3)',
      [id, albumId, songId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke album.')
    }
  }

  const getSongs = async ({ title, performer }) => {
    let result = await pool.query('SELECT * FROM songs')

    if (title && performer) {
      result = await getSongsByTitleAndPerformer(title, performer)
    } else if (title || performer) {
      result = await getSongsByTitleOrPerformer(title, performer)
    }

    return result.rows.map(mapDBToSongsModel)
  }

  const getSongsByAlbumId = async (albumId) => {
    const results = await pool.query(
      'SELECT songs.* FROM songs LEFT JOIN album_songs ON album_songs.song_id = songs.id WHERE album_songs.album_id = $1',
      [albumId]
    )

    return results.rows.map(mapDBToSongsModel)
  }

  const getSongsByTitleAndPerformer = async (title, performer) => {
    return await pool.query(
      'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      [`%${title}%`, `%${performer}%`]
    )
  }

  const getSongsByTitleOrPerformer = async (title, performer) => {
    return await pool.query(
      'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)',
      [`%${title}%`, `%${performer}%`]
    )
  }

  const getSong = async (id) => {
    const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id])

    if (!result.rowCount) throw new NotFoundError('Lagu tidak ditemukan')

    return mapDBToSongModel(result.rows[0])
  }

  const editSong = async (id, { title, year, performer, genre, duration }) => {
    const updatedAt = new Date()

    const song = await pool.query(
      'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      [title, year, performer, genre, duration, updatedAt, id]
    )

    if (!song.rowCount) {
      throw new NotFoundError('Lagu gagal diperbarui. Id tidak ditemukan')
    }
  }

  const deleteSong = async (id) => {
    const song = await pool.query(
      'DELETE FROM songs WHERE id = $1 RETURNING id',
      [id]
    )

    if (!song.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
  }

  return {
    addSong,
    addSongToAlbum,
    getSongs,
    getSongsByAlbumId,
    getSongsByTitleAndPerformer,
    getSongsByTitleOrPerformer,
    getSong,
    editSong,
    deleteSong
  }
}
