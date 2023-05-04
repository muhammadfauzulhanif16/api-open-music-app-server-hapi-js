exports.SongHandlers = (songServices, validator) => {
  const addSong = async (req, h) => {
    validator.validateSongPayload(req.payload)

    const songId = await songServices.addSong(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          songId
        }
      })
      .code(201)
  }

  const getSong = async (req) => {
    const song = await songServices.getSong(req.params.id)

    return {
      status: 'success',
      data: {
        song
      }
    }
  }

  const getSongs = async (req) => {
    const songs = await songServices.getSongs(req.query)

    return {
      status: 'success',
      data: {
        songs
      }
    }
  }

  const editSong = async (req) => {
    validator.validateSongPayload(req.payload)

    await songServices.editSong(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui'
    }
  }

  const deleteSong = async (req) => {
    await songServices.deleteSong(req.params.id)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus'
    }
  }

  return {
    addSong,
    getSong,
    getSongs,
    editSong,
    deleteSong
  }
}
