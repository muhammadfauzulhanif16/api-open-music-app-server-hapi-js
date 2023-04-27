const { AlbumPayloadScheme } = require('./scheme')
const { InvariantError } = require('../../exceptions')

exports.AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const { error } = AlbumPayloadScheme.validate(payload)

    if (error) throw new InvariantError(error.message)
  },
}
