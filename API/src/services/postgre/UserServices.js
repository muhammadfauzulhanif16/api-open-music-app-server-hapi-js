const { Pool } = require('pg')
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const {
  InvariantError,
  AuthenticationError,
  NotFoundError
} = require('../../exceptions')

exports.UserServices = () => {
  const addUser = async ({ username, password, fullname }) => {
    await verifyUsername(username)

    const id = uuid.v4()
    const hashedPassword = await bcrypt.hash(password, 16)
    const createdAt = new Date()

    const result = await new Pool().query(
      'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      [id, username, hashedPassword, fullname, createdAt, createdAt]
    )

    if (!result.rowCount) {
      throw new InvariantError('Pengguna baru gagal ditambahkan')
    }

    return result.rows[0].id
  }

  const verifyUsername = async (username) => {
    const result = await new Pool().query(
      'SELECT username FROM users WHERE username = $1',
      [username]
    )

    if (result.rowCount > 0) {
      throw new InvariantError('Nama pengguna sudah digunakan.')
    }
  }

  const verifyCredential = async (username, password) => {
    const result = await new Pool().query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (
      !result.rowCount ||
      !(await bcrypt.compare(password, result.rows[0].password))
    ) {
      throw new AuthenticationError('Kredensial salah')
    }

    return result.rows[0].id
  }

  const getUser = async (userId) => {
    const result = await new Pool().query('SELECT * FROM users WHERE id = $1', [
      userId
    ])

    if (!result.rowCount) {
      throw new NotFoundError('Pengguna tidak ditemukan')
    }
  }

  return {
    addUser,
    verifyUsername,
    verifyCredential,
    getUser
  }
}
