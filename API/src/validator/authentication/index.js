const {
  AddAuthentication,
  EditAuthentication,
  DeleteAuthentication
} = require('./schema')
const { InvariantError } = require('../../exceptions')

exports.AuthenticationValidator = {
  addAuthentication: (payload) => {
    if (AddAuthentication.validate(payload).error) {
      throw new InvariantError(
        AddAuthentication.validate(payload).error.message
      )
    }
  },
  editAuthentication: (payload) => {
    if (EditAuthentication.validate(payload).error) {
      throw new InvariantError(
        EditAuthentication.validate(payload).error.message
      )
    }
  },
  deleteAuthentication: (payload) => {
    if (DeleteAuthentication.validate(payload).error) {
      throw new InvariantError(
        DeleteAuthentication.validate(payload).error.message
      )
    }
  }
}
