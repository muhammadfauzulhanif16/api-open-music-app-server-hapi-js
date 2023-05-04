const { SongPayloadSchema } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.SongValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  }
}
