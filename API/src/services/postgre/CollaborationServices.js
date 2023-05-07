const uuid = require('uuid')
const { Pool } = require('pg')
const { InvariantError } = require('../../exceptions')

exports.CollaborationServices = () => {
  const addCollaboration = async (playlistId, userId) => {
    const id = uuid.v4()

    const result = await new Pool().query(
      'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      [id, playlistId, userId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const verifyCollaborator = async (playlistId, userId) => {
    const result = await new Pool().query(
      'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      [playlistId, userId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi')
    }
  }

  const deleteCollaboration = async (playlistId, userId) => {
    const result = await new Pool().query(
      'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      [playlistId, userId]
    )

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus')
    }
  }

  return {
    addCollaboration,
    verifyCollaborator,
    deleteCollaboration
  }
}
