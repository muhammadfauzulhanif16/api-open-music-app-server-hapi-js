const { AlbumHandlers } = require('./handlers')
const { AlbumRoutes } = require('./routes')

exports.Album = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { albumServices, validator }) => {
    server.route(AlbumRoutes(AlbumHandlers(albumServices, validator)))
  }
}
