const Joi = require('joi')

exports.PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().min(1)
})

exports.PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required()
})
