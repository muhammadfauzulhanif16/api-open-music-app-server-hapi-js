exports.CollaborationHandlers = (
  validator,
  userServices,
  playlistServices,
  collaborationServices
) => {
  const addCollaboration = async (req, h) => {
    validator.validateCollaborationPayload(req.payload)

    await playlistServices.getPlaylist(req.payload.playlistId)
    await userServices.getUser(req.payload.userId)
    await playlistServices.verifyOwner(
      req.payload.playlistId,
      req.auth.credentials.id
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
    validator.validateCollaborationPayload(req.payload)

    await playlistServices.verifyOwner(
      req.payload.playlistId,
      req.auth.credentials.id
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
