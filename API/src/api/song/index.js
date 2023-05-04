const { SongHandlers } = require('./handlers')
const { SongRoutes } = require('./routes')

exports.Song = {
  name: 'song',
  version: '1.0.0',
  register: async (server, { songServices, validator }) => {
    server.route(SongRoutes(SongHandlers(songServices, validator)))
  }
}
