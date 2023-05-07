exports.ExportHandlers = (validators, playlistServices, producerServices) => {
  const addExportPlaylist = async (req, h) => {
    validators.email(req.payload)

    await playlistServices.verifyOwner(
      req.params.id,
      req.auth.credentials.userId
    )
    // await playlistServices.getPlaylist(req.params.id)
    await producerServices.sendMessage(
      'export:playlist',
      JSON.stringify({
        playlistId: req.params.id,
        targetEmail: req.payload.targetEmail
      })
    )

    return h
      .response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses'
      })
      .code(201)
  }

  return {
    addExportPlaylist
  }
}
