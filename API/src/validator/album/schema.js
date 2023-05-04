const Joi = require('joi')

exports.AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().min(1),
  year: Joi.number().required().min(1900).positive()
})
