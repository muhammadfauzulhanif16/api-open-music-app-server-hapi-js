const Joi = require('joi')

exports.Song = Joi.object({
  title: Joi.string().required().min(1),
  year: Joi.number().required().min(1900).positive(),
  performer: Joi.string().required().min(1),
  genre: Joi.string().required().min(1),
  duration: Joi.number().min(1).positive(),
  albumId: Joi.string().min(1)
})
