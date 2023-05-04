exports.Listener = (playlistServices, mailSender) => {
  const listen = async (message) => {
    try {
      const {playlistId, targetEmail} = JSON.parse(message.content.toString())

      const playlist = await playlistServices.getPlaylist(playlistId)
      const songs = await playlistServices.getSongs(playlistId)

      await mailSender.sendEmail(targetEmail, JSON.stringify({
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: songs.map((song) => {
            return {
              id: song.id,
              title: song.title,
              performer: song.performer
            }
          })
        }
      }))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    listen
  }
}
