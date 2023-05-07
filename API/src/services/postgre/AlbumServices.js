const uuid = require('uuid')
const { Pool } = require('pg')
const { InvariantError, NotFoundError } = require('../../exceptions')
const {
  mapDBToAlbumModel,
  mapDBToSongsModel
} = require('../../utils/formatter')

exports.AlbumServices = (cacheServices) => {
  const addAlbum = async ({ name, year }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await new Pool().query(
      'INSERT INTO albums VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [id, name, year, null, createdAt, createdAt]
    )

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const addCover = async (albumId, fileLocation) => {
    const updatedAt = new Date()

    const result = await new Pool().query(
      'UPDATE albums SET cover = $1, updated_at = $2 WHERE id = $3',
      [fileLocation, updatedAt, albumId]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Sampul album gagal diperbarui')
    }
  }

  const addLike = async (albumId, userId) => {
    const id = uuid.v4()

    const result = await new Pool().query(
      'INSERT INTO album_likes VALUES($1, $2, $3)',
      [id, albumId, userId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Album gagal disukai')
    }

    await cacheServices.deleteCache(`likes:${albumId}`)
  }

  const getAlbum = async (id) => {
    const result = await new Pool().query(
      'SELECT * FROM albums WHERE id = $1',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return mapDBToAlbumModel(result.rows[0])
  }

  const getSongs = async (albumId) => {
    const result = await new Pool().query(
      'SELECT * FROM songs WHERE album_id = $1',
      [albumId]
    )

    return result.rows.map(mapDBToSongsModel)
  }

  const getLikes = async (albumId) => {
    try {
      const result = await cacheServices.getCache(`likes:${albumId}`)
      return [result, true]
    } catch (error) {
      const result = await new Pool().query(
        'SELECT * FROM album_likes WHERE album_id = $1',
        [albumId]
      )

      await cacheServices.setCache(`likes:${albumId}`, result.rowCount)

      return [result.rowCount, false]
    }
  }

  const verifyLike = async (albumId, userId) => {
    const result = await new Pool().query(
      'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      [albumId, userId]
    )

    if (result.rowCount > 0) {
      throw new InvariantError('Album sudah disukai')
    }
  }

  const editAlbum = async (id, { name, year }) => {
    const updatedAt = new Date()

    const result = await new Pool().query(
      'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4',
      [name, year, updatedAt, id]
    )

    if (!result.rowCount) {
      throw new InvariantError('Album gagal diperbarui')
    }
  }

  const deleteLike = async (albumId, userId) => {
    const result = await new Pool().query(
      'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2',
      [albumId, userId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Album gagal tidak disukai')
    }

    await cacheServices.deleteCache(`likes:${albumId}`)
  }

  const deleteAlbum = async (id) => {
    const result = await new Pool().query('DELETE FROM albums WHERE id = $1', [
      id
    ])

    if (!result.rowCount) {
      throw new InvariantError('Album gagal dihapus')
    }
  }

  return {
    addAlbum,
    addCover,
    addLike,
    getAlbum,
    getSongs,
    getLikes,
    verifyLike,
    editAlbum,
    deleteLike,
    deleteAlbum
  }
}
