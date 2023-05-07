const { Email } = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.ExportValidator = {
  email: (payload) => {
    if (Email.validate(payload).error) {
      throw new InvariantError(Email.validate(payload).error.message)
    }
  }
}
