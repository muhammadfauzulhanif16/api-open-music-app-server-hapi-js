exports.UserHandlers = (validators, services) => {
  const addUser = async (req, h) => {
    validators.validateUserPayload(req.payload)

    const userId = await services.addUser(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          userId
        }
      })
      .code(201)
  }

  return {
    addUser
  }
}
