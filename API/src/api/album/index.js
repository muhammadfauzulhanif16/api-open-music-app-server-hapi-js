const { AlbumHandlers } = require('./handlers')
const { AlbumRoutes } = require('./routes')

exports.Album = {
  name: 'album',
  version: '1.0.0',
  register: async (server, { validators, albumServices, storageServices }) => {
    server.route(
      AlbumRoutes(AlbumHandlers(validators, albumServices, storageServices))
    )
  }
}
