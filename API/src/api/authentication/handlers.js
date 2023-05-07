exports.AuthenticationHandlers = (
  validators,
  userServices,
  tokenManager,
  authenticationServices
) => {
  const addAuthentication = async (req, h) => {
    validators.addAuthentication(req.payload)

    const userId = await userServices.verifyCredential(
      req.payload.username,
      req.payload.password
    )
    const accessToken = tokenManager.generateAccessToken({ userId })
    const refreshToken = tokenManager.generateRefreshToken({ userId })

    await authenticationServices.addRefreshToken(refreshToken)

    return h
      .response({
        status: 'success',
        message: 'Autentikasi berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken
        }
      })
      .code(201)
  }

  const editAuthentication = async (req) => {
    validators.editAuthentication(req.payload)

    await authenticationServices.verifyRefreshToken(req.payload.refreshToken)

    const { userId } = tokenManager.verifyRefreshToken(req.payload.refreshToken)
    const accessToken = tokenManager.generateAccessToken({ userId })

    return {
      status: 'success',
      message: 'Access token berhasil diperbarui',
      data: {
        accessToken
      }
    }
  }

  const deleteAuthentication = async (req) => {
    validators.deleteAuthentication(req.payload)

    await authenticationServices.verifyRefreshToken(req.payload.refreshToken)
    await authenticationServices.deleteRefreshToken(req.payload.refreshToken)

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus'
    }
  }

  return {
    addAuthentication,
    editAuthentication,
    deleteAuthentication
  }
}
