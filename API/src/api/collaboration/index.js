const { CollaborationHandlers } = require('./handlers')
const { CollaborationRoutes } = require('./routes')

exports.Collaboration = {
  name: 'collaboration',
  version: '1.0.0',
  register: async (
    server,
    { validators, playlistServices, userServices, collaborationServices }
  ) => {
    server.route(
      CollaborationRoutes(
        CollaborationHandlers(
          validators,
          playlistServices,
          userServices,
          collaborationServices
        )
      )
    )
  }
}
