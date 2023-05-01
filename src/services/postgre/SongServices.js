const { Pool } = require('pg')
const uuid = require('uuid')
const { InvariantError, NotFoundError } = require('../../exceptions')
const { mapDBToSongsModel, mapDBToSongModel } = require('../../utils')

exports.SongServices = () => {
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

    const result = await new Pool().query(
      'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING id',
      [
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
    )

    if (!result.rows[0].id) throw new InvariantError('Lagu gagal ditambahkan')

    return result.rows[0].id
  }

  const getSong = async (id) => {
    const result = await new Pool().query('SELECT * FROM songs WHERE id = $1', [
      id
    ])

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal ditampilkan. Lagu tidak ditemukan')
    }

    return mapDBToSongModel(result.rows[0])
  }

  const getSongs = async ({ title, performer }) => {
    let result = await new Pool().query('SELECT * FROM songs')

    if (title && performer) {
      result = await getSongsByTitleAndPerformer(title, performer)
    } else if (title || performer) {
      result = await getSongsByTitleOrPerformer(title, performer)
    }

    return result.rows.map(mapDBToSongsModel)
  }

  const getSongsByTitleOrPerformer = async (title, performer) => {
    return await new Pool().query(
      'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) OR LOWER(performer) LIKE LOWER($2)',
      [`%${title}%`, `%${performer}%`]
    )
  }

  const getSongsByTitleAndPerformer = async (title, performer) => {
    return await new Pool().query(
      'SELECT * FROM songs WHERE LOWER(title) LIKE LOWER($1) AND LOWER(performer) LIKE LOWER($2)',
      [`%${title}%`, `%${performer}%`]
    )
  }

  const editSong = async (id, { title, year, performer, genre, duration }) => {
    const updatedAt = new Date()

    const result = await new Pool().query(
      'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7',
      [title, year, performer, genre, duration, updatedAt, id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal diperbarui. Lagu tidak ditemukan')
    }
  }

  const deleteSong = async (id) => {
    const result = await new Pool().query('DELETE FROM songs WHERE id = $1', [
      id
    ])

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Lagu tidak ditemukan')
    }
  }

  return {
    addSong,
    getSong,
    getSongs,
    getSongsByTitleOrPerformer,
    getSongsByTitleAndPerformer,
    editSong,
    deleteSong
  }
}
