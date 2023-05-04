exports.ExportHandlers = (producerServices, playlistServices, validator) => {
  const addExportPlaylist = async (req, h) => {
    validator.validateExportPlaylistPayload(req.payload)
    await playlistServices.verifyAccess(req.params.id, req.auth.credentials.id)
    await playlistServices.getPlaylist(req.params.id)

    await producerServices.sendMessage(
      'export:playlist',
      JSON.stringify({
        userId: req.auth.credentials.id,
        targetEmail: req.payload.targetEmail
      })
    )

    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda dalam antrean'
      })
      .code(201)
  }

  return {
    addExportPlaylist
  }
}
