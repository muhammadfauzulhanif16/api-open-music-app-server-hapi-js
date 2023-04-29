exports.UserHandlers = (userServices, validator) => {
  const addUser = async (req, h) => {
    validator.validateUserPayload(req.payload)

    const userId = await userServices.addUser(req.payload)

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
