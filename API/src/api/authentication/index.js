const { AuthenticationHandlers } = require('./handlers')
const { AuthenticationRoutes } = require('./routes')

exports.Authentication = {
  name: 'authentication',
  version: '1.0.0',
  register: async (
    server,
    { validators, userServices, tokenManager, authenticationServices }
  ) => {
    server.route(
      AuthenticationRoutes(
        AuthenticationHandlers(
          validators,
          userServices,
          tokenManager,
          authenticationServices
        )
      )
    )
  }
}
