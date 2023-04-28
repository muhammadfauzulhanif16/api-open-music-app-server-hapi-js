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

    const song = await pool.query({
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [
        id,
        title,
        year,
        performer,
        genre,
        duration,
        albumId,
        createdAt,
        createdAt
      ]
    })

    if (!song.rows[0].id) throw new InvariantError('Lagu gagal ditambahkan')

    return song.rows[0].id
  }

  const getSongs = async ({ title, performer }) => {
    let songs

    if (title && performer) {
      songs = await pool.query(
        'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
        [`%${title}%`, `%${performer}%`]
      )
    } else if (title || performer) {
      songs = await pool.query(
        'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)',
        [`%${title}%`, `%${performer}%`]
      )
    } else songs = await pool.query('SELECT * FROM songs')

    return songs.rows.map(mapDBToSongsModel)
  }

  const getSong = async (id) => {
    const song = await pool.query('SELECT * FROM songs WHERE id = $1', [id])

    if (!song.rowCount) throw new NotFoundError('Lagu tidak ditemukan')

    return song.rows[0].map(mapDBToSongModel)
  }

  const editSong = async (
    id,
    { title, year, performer, genre, duration, albumId }
  ) => {
    const updatedAt = new Date()

    const song = await pool.query(
      'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      [title, year, performer, genre, duration, albumId, updatedAt, id]
    )

    if (!song.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
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
    getSongs,
    getSong,
    editSong,
    deleteSong
  }
}
