const { Pool } = require('pg');

exports.NoteServices = () => {
  const getNotes = async (userId) => {
    const result = await new Pool().query(
      "SELECT notes.* FROM notes LEFT JOIN collaborations ON collaborations.note_id = notes.id WHERE notes.owner = $1 OR collaborations.user_id = $1 GROUP BY notes.id",
      [userId]
    )

    return result.rows
  }

  return {
    getNotes
  }
}
