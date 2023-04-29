const { AlbumServices } = require('./postgre/albumServices')
const { SongServices } = require('./postgre/songServices')
const { UserServices } = require('./postgre/userServices')
const { AuthenticationServices } = require('./postgre/authenticationServices')

module.exports = {
  AlbumServices,
  SongServices,
  UserServices,
  AuthenticationServices
}
