const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const { error } = PlaylistPayloadSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  },
  validateSongToPlaylistPayload: (payload) => {
    const { error } = PlaylistSongPayloadSchema.validate(payload)
    if (error) throw new InvariantError(error.message)
  }
}
