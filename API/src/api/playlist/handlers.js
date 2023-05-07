exports.PlaylistHandlers = (playlistServices, songServices, validators) => {
  const addPlaylist = async (req, h) => {
    validators.addPlaylist(req.payload)

    const playlistId = await playlistServices.addPlaylist(
      req.payload.name,
      req.auth.credentials.userId
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

  const addSong = async (req, h) => {
    validators.song(req.payload)

    await playlistServices.verifyAccess(
      req.params.id,
      req.auth.credentials.userId
    )
    await songServices.getSong(req.payload.songId)
    await playlistServices.addSong(
      req.params.id,
      req.auth.credentials.userId,
      req.payload.songId
    )

    return h
      .response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke daftar putar'
      })
      .code(201)
  }

  const getPlaylist = async (req) => {
    await playlistServices.verifyAccess(
      req.params.id,
      req.auth.credentials.userId
    )

    const playlist = await playlistServices.getPlaylist(req.params.id)
    const songs = await playlistServices.getSongs(req.params.id)

    return {
      status: 'success',
      data: {
        playlist: {
          ...playlist,
          songs
        }
      }
    }
  }

  const getPlaylists = async (req) => {
    const playlists = await playlistServices.getPlaylists(
      req.auth.credentials.userId
    )

    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  const getActivities = async (req) => {
    await playlistServices.verifyAccess(
      req.params.id,
      req.auth.credentials.userId
    )

    const { id: playlistId } = await playlistServices.getPlaylist(req.params.id)
    const activities = await playlistServices.getActivities(req.params.id)

    return {
      status: 'success',
      data: {
        playlistId,
        activities
      }
    }
  }

  const deleteSong = async (req) => {
    validators.song(req.payload)

    await playlistServices.verifyAccess(
      req.params.id,
      req.auth.credentials.userId
    )

    await songServices.getSong(req.payload.songId)
    await playlistServices.deleteSong(
      req.params.id,
      req.payload.songId,
      req.auth.credentials.userId
    )

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari daftar putar'
    }
  }

  const deletePlaylist = async (req) => {
    await playlistServices.verifyOwner(
      req.params.id,
      req.auth.credentials.userId
    )
    await playlistServices.getPlaylist(req.params.id)
    await playlistServices.deletePlaylist(req.params.id)

    return {
      status: 'success',
      message: 'Daftar putar berhasil dihapus'
    }
  }

  return {
    addPlaylist,
    addSong,
    getPlaylist,
    getPlaylists,
    getActivities,
    deleteSong,
    deletePlaylist
  }
}
