const { ExportPlaylistPayloadSchema } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.ExportValidator = {
  validateExportPlaylistPayload: (payload) => {
    const { error } = ExportPlaylistPayloadSchema.validate(payload)

    if (error) throw new InvariantError(error.message)
  }
}
