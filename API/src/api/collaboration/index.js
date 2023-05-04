const { CollaborationHandlers } = require('./handlers')
const { CollaborationRoutes } = require('./routes')

exports.Collaboration = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (
    server,
    { validator, userServices, playlistServices, collaborationServices }
  ) => {
    server.route(
      CollaborationRoutes(
        CollaborationHandlers(
          validator,
          userServices,
          playlistServices,
          collaborationServices
        )
      )
    )
  }
}
