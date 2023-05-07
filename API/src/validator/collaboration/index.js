const { InvariantError } = require('../../exceptions')
const { Collaboration } = require('./schema')

exports.CollaborationValidator = {
  collaboration: (payload) => {
    if (Collaboration.validate(payload).error) {
      throw new InvariantError(Collaboration.validate(payload).error.message)
    }
  }
}
