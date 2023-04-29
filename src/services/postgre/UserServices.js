require('dotenv').config()
const { Pool } = require('pg')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const { InvariantError, AuthenticationError } = require('../../exceptions')

exports.UserServices = () => {
  const pool = new Pool()

  const addUser = async ({ username, password, fullname }) => {
    await verifyNewUsername(username)

    const id = uuid.v4()
    const hashedPassword = await bcrypt.hash(password, 16)
    const createdAt = new Date()

    const result = await pool.query(
      'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [id, username, hashedPassword, fullname, createdAt, createdAt]
    )

    if (!result.rowCount) {
      throw new InvariantError('Pengguna baru gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const verifyNewUsername = async (username) => {
    const result = await pool.query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    )

    if (result.rowCount > 0) {
      throw new InvariantError(
        'Pengguna baru gagal ditambahkan. Nama pengguna sudah digunakan.'
      )
    }
  }

  const verifyUserCredential = async (username, password) => {
    const result = await pool.query(
      'SELECT id, password FROM users WHERE username = $1',
      [username]
    )

    if (!result.rowCount) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }

    const { id, password: hashedPassword } = result.rows[0]
    const isValid = await bcrypt.compare(password, hashedPassword)

    if (!isValid) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah')
    }

    return id
  }

  return {
    addUser,
    verifyNewUsername,
    verifyUserCredential
  }
}
