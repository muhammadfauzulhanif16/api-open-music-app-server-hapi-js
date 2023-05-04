const {Pool} = require('pg');

exports.PlaylistServices = () => {
  const getPlaylist = async (id) => {
    const result = await new Pool().query(
      'SELECT playlists.*, users.username FROM playlists LEFT JOIN users ON playlists.owner = users.id WHERE playlists.id = $1',
      [id]
    )

    return result.rows[0]
  }

  const getSongs = async (playlistId) => {
    const result = await new Pool().query(
      'SELECT songs.* FROM songs LEFT JOIN playlist_songs ON songs.id = playlist_songs.song_id WHERE playlist_songs.playlist_id = $1',
      [playlistId]
    )

    return result.rows
  }

  return {
    getPlaylist,
    getSongs
  }
}
