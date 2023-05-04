const { AlbumPayloadSchema } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  }
}
