const { Pool } = require('pg')
const { InvariantError } = require('../../exceptions')

exports.AuthenticationServices = () => {
  const addRefreshToken = async (token) => {
    await new Pool().query('INSERT INTO authentications VALUES($1)', [token])
  }

  const verifyRefreshToken = async (token) => {
    const result = await new Pool().query(
      'SELECT token FROM authentications WHERE token = $1',
      [token]
    )

    if (!result.rowCount) throw new InvariantError('Refresh token tidak sah')
  }

  const deleteRefreshToken = async (token) => {
    await verifyRefreshToken(token)
    await new Pool().query('DELETE FROM authentications WHERE token = $1', [
      token
    ])
  }

  return {
    addRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken
  }
}
