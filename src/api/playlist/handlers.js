exports.PlaylistHandlers = (playlistServices, validator) => {
  const addPlaylist = async (req, h) => {
    validator.validatePlaylistPayload(req.payload)

    const playlistId = await playlistServices.addPlaylist(
      req.payload,
      req.auth.credentials.id
    )

    return h
      .response({
        status: 'success',
        data: {
          playlistId
        }
      })
      .code(201)
  }

  return {
    addPlaylist
  }
}
