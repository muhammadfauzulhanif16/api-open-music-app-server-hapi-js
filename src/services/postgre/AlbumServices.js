require('dotenv').config()
const { Pool } = require('pg')
const uuid = require('uuid')
const { InvariantError, NotFoundError } = require('../../exceptions')
const { mapDBToAlbumModel } = require('../../utils')

exports.AlbumServices = (songServices) => {
  const pool = new Pool()

  const addAlbum = async ({ name, year }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, year, createdAt, createdAt]
    )

    if (!result.rows[0].id) throw new InvariantError('Album gagal ditambahkan')

    return result.rows[0].id
  }

  const getAlbum = async (id) => {
    const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id])

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const songs = await songServices.getSongsByAlbumId(id)

    return mapDBToAlbumModel(result.rows[0], songs)
  }

  const editAlbum = async (id, { name, year }) => {
    const updatedAt = new Date()

    const result = await pool.query(
      'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      [name, year, updatedAt, id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal diperbarui. Id tidak ditemukan')
    }
  }

  const deleteAlbum = async (id) => {
    const result = await pool.query(
      'DELETE FROM albums WHERE id = $1 RETURNING id',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }

  return {
    addAlbum,
    getAlbum,
    editAlbum,
    deleteAlbum
  }
}
