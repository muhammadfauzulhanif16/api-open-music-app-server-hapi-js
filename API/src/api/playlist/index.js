const { PlaylistHandlers } = require('./handlers')
const { PlaylistRoutes } = require('./routes')

exports.Playlist = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { playlistServices, songServices, validators }) => {
    server.route(
      PlaylistRoutes(
        PlaylistHandlers(playlistServices, songServices, validators)
      )
    )
  }
}
