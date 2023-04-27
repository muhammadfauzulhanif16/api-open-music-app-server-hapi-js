require('dotenv').config()
const { Pool } = require('pg')
const uuid = require('uuid')

const { InvariantError, NotFoundError } = require('../../exceptions')
const { mapDBToAlbumModel, mapDBToSongsModel } = require('../../utils')

exports.AlbumServices = () => {
  const pool = new Pool()

  const postAlbumService = async ({ name, year }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const album = await pool.query({
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, createdAt],
    })

    if (!album.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return album.rows[0].id
  }

  const getAlbumByIdService = async (id) => {
    const album = await pool.query({
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    })

    if (!album.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    const songs = await pool.query({
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    })

    return mapDBToAlbumModel(album.rows[0], songs.rows.map(mapDBToSongsModel))
  }

  const putAlbumByIdService = async (id, { name, year }) => {
    const updatedAt = new Date()

    const album = await pool.query({
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    })

    if (!album.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan')
    }
  }

  const deleteAlbumByIdService = async (id) => {
    const album = await pool.query({
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    })

    if (!album.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan')
    }
  }

  return {
    postAlbumService,
    getAlbumByIdService,
    putAlbumByIdService,
    deleteAlbumByIdService,
  }
}
