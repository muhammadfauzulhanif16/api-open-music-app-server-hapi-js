exports.CollaborationHandlers = (
  validators,
  playlistServices,
  userServices,
  collaborationServices
) => {
  const addCollaboration = async (req, h) => {
    validators.collaboration(req.payload)

    await playlistServices.getPlaylist(req.payload.playlistId)
    await userServices.getUser(req.payload.userId)
    await playlistServices.verifyOwner(
      req.payload.playlistId,
      req.auth.credentials.userId
    )
    const collaborationId = await collaborationServices.addCollaboration(
      req.payload.playlistId,
      req.payload.userId
    )

    return h
      .response({
        status: 'success',
        message: 'Kolaborasi berhasil ditambahkan',
        data: {
          collaborationId
        }
      })
      .code(201)
  }

  const deleteCollaboration = async (req) => {
    validators.collaboration(req.payload)

    await playlistServices.getPlaylist(req.payload.playlistId)
    await userServices.getUser(req.payload.userId)
    await playlistServices.verifyOwner(
      req.payload.playlistId,
      req.auth.credentials.userId
    )
    await collaborationServices.deleteCollaboration(
      req.payload.playlistId,
      req.payload.userId
    )

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus'
    }
  }

  return {
    addCollaboration,
    deleteCollaboration
  }
}
