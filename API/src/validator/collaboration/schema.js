const Joi = require('joi')

exports.Collaboration = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required()
})
