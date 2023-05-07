const Jwt = require('@hapi/jwt')
const { InvariantError } = require('../exceptions')
const { config } = require('../utils/config')

exports.TokenManager = {
  generateAccessToken: (payload) =>
    Jwt.token.generate(payload, config.auth.access.key),
  generateRefreshToken: (payload) =>
    Jwt.token.generate(payload, config.auth.refresh.key),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, config.auth.refresh.key)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token tidak sah')
    }
  }
}
