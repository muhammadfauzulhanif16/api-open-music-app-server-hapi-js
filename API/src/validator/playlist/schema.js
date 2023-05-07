const Joi = require('joi')

exports.AddPlaylist = Joi.object({
  name: Joi.string().required().min(1)
})

exports.Song = Joi.object({
  songId: Joi.string().required()
})
