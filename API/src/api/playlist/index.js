const { PlaylistHandlers } = require('./handlers')
const { PlaylistRoutes } = require('./routes')

exports.Playlist = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { validator, songServices, playlistServices }) => {
    server.route(
      PlaylistRoutes(
        PlaylistHandlers(validator, songServices, playlistServices)
      )
    )
  }
}
