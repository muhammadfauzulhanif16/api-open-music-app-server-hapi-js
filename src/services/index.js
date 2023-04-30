const { AlbumServices } = require('./postgre/albumServices')
const { SongServices } = require('./postgre/songServices')
const { UserServices } = require('./postgre/userServices')
const { AuthenticationServices } = require('./postgre/authenticationServices')
const { PlaylistServices } = require('./postgre/playlistServices')

module.exports = {
  AlbumServices,
  SongServices,
  UserServices,
  AuthenticationServices,
  PlaylistServices
}
