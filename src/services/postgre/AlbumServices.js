const uuid = require('uuid')
const { Pool } = require('pg')
const { InvariantError, NotFoundError } = require('../../exceptions')
const { mapDBToAlbumModel, mapDBToSongsModel } = require('../../utils')

exports.AlbumServices = () => {
  const addAlbum = async ({ name, year }) => {
    const id = uuid.v4()
    const createdAt = new Date()

    const result = await new Pool().query(
      'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      [id, name, year, createdAt, createdAt]
    )

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const addSong = async (albumId, songId) => {
    const id = uuid.v4()

    const result = await new Pool().query(
      'INSERT INTO album_songs VALUES($1, $2, $3)',
      [id, albumId, songId]
    )

    if (!result.rowCount) {
      throw new InvariantError(
        'Lagu gagal ditambahkan ke album. Album tidak ditemukan'
      )
    }
  }

  const getAlbum = async (id) => {
    const result = await new Pool().query(
      'SELECT * FROM albums WHERE id = $1',
      [id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal ditampilkan. Album tidak ditemukan')
    }

    const songs = await getSongs(id)

    return mapDBToAlbumModel(result.rows[0], songs)
  }

  const getSongs = async (albumId) => {
    const result = await new Pool().query(
      'SELECT songs.* FROM songs LEFT JOIN album_songs ON album_songs.song_id = songs.id WHERE album_songs.album_id = $1',
      [albumId]
    )

    return result.rows.map(mapDBToSongsModel)
  }

  const editAlbum = async (id, { name, year }) => {
    const updatedAt = new Date()

    const result = await new Pool().query(
      'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4',
      [name, year, updatedAt, id]
    )

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal diperbarui. Album tidak ditemukan')
    }
  }

  const deleteAlbum = async (id) => {
    const result = await new Pool().query('DELETE FROM albums WHERE id = $1', [
      id
    ])

    if (!result.rowCount) {
      throw new NotFoundError('Album gagal dihapus. Album tidak ditemukan')
    }
  }

  return {
    addAlbum,
    addSong,
    getAlbum,
    getSongs,
    editAlbum,
    deleteAlbum
  }
}
