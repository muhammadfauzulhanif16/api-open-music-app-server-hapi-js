const Joi = require('joi')

exports.PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required().min(1)
})
