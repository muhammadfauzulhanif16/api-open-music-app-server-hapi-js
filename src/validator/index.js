const { AlbumValidator } = require('./album')
const { SongValidator } = require('./song')
const { UserValidator } = require('./user')
const { AuthenticationValidator } = require('./authentication')

module.exports = {
  AlbumValidator,
  SongValidator,
  UserValidator,
  AuthenticationValidator
}
