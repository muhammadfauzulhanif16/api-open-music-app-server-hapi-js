exports.AlbumHandlers = (validator, albumServices) => {
  const addAlbum = async (req, h) => {
    validator.validateAlbumPayload(req.payload)

    const albumId = await albumServices.addAlbum(req.payload)

    return h
      .response({
        status: 'success',
        data: {
          albumId
        }
      })
      .code(201)
  }

  const getAlbum = async (req) => {
    const album = await albumServices.getAlbum(req.params.id)

    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  const editAlbum = async (req) => {
    validator.validateAlbumPayload(req.payload)

    await albumServices.editAlbum(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  const deleteAlbum = async (req) => {
    await albumServices.deleteAlbum(req.params.id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }

  return {
    addAlbum,
    getAlbum,
    editAlbum,
    deleteAlbum
  }
}
