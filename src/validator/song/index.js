const { SongPayloadScheme } = require('./scheme')
const { InvariantError } = require('../../exceptions')

exports.SongValidator = {
  validateSongPayload: (payload) => {
    const { error } = SongPayloadScheme.validate(payload)

    if (error) {
      throw new InvariantError(error.message)
    }
  },
}
