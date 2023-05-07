exports.AlbumHandlers = (validators, albumServices, storageServices) => {
  const addAlbum = async (req, h) => {
    validators.album(req.payload)

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

  const addCover = async (req, h) => {
    validators.addAlbumCover(req.payload.cover.hapi.headers)

    const { coverUrl } = await albumServices.getAlbum(req.params.id)

    if (coverUrl !== null) {
      await storageServices.deleteFile(coverUrl)
    }

    const fileName = await storageServices.writeFile(
      req.payload.cover,
      req.payload.cover.hapi
    )

    await albumServices.addCover(
      req.params.id,
      `http://localhost:5000/albums/covers/${fileName}`
    )

    return h
      .response({
        status: 'success',
        message: 'Sampul album berhasil diperbarui'
      })
      .code(201)
  }

  const addLike = async (req, h) => {
    await albumServices.getAlbum(req.params.id)
    await albumServices.verifyLike(req.params.id, req.auth.credentials.userId)
    await albumServices.addLike(req.params.id, req.auth.credentials.userId)

    return h
      .response({
        status: 'success',
        message: 'Album berhasil disukai'
      })
      .code(201)
  }

  const getAlbum = async (req) => {
    await albumServices.getAlbum(req.params.id)

    const album = await albumServices.getAlbum(req.params.id)
    const songs = await albumServices.getSongs(req.params.id)

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs
        }
      }
    }
  }

  const getLikes = async (req, h) => {
    await albumServices.getAlbum(req.params.id)

    const [result, isCache] = await albumServices.getLikes(req.params.id)

    const response = h.response({
      status: 'success',
      data: {
        likes: parseInt(result)
      }
    })

    if (isCache) {
      response.header('X-Data-Source', 'cache')
    }

    return response
  }

  const editAlbum = async (req) => {
    validators.album(req.payload)

    await albumServices.getAlbum(req.params.id)
    await albumServices.editAlbum(req.params.id, req.payload)

    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  const deleteLike = async (req) => {
    await albumServices.getAlbum(req.params.id)
    await albumServices.deleteLike(req.params.id, req.auth.credentials.userId)

    return {
      status: 'success',
      message: 'Album berhasil tidak disukai'
    }
  }

  const deleteAlbum = async (req) => {
    await albumServices.getAlbum(req.params.id)
    await albumServices.deleteAlbum(req.params.id)

    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }

  return {
    addAlbum,
    addCover,
    addLike,
    getAlbum,
    getLikes,
    editAlbum,
    deleteLike,
    deleteAlbum
  }
}
