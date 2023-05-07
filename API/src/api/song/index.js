const { SongHandlers } = require('./handlers')
const { SongRoutes } = require('./routes')

exports.Song = {
  name: 'song',
  version: '1.0.0',
  register: async (server, { validators, services }) => {
    server.route(SongRoutes(SongHandlers(validators, services)))
  }
}
