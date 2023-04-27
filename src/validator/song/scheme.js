const Joi = require('joi')

exports.SongPayloadScheme = Joi.object({
  title: Joi.string().required().min(1),
  year: Joi.number().required().min(1900).positive(),
  genre: Joi.string().required().min(1),
  performer: Joi.string().required().min(1),
  duration: Joi.number().min(1).positive(),
  albumId: Joi.string().min(1),
})
