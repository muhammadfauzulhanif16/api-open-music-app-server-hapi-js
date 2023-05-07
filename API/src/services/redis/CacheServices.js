const redis = require('redis')
const { ClientError } = require('../../exceptions')
const { config } = require('../../utils/config')

exports.CacheServices = () => {
  const client = redis.createClient({
    socket: {
      host: config.redis.host
    }
  })

  client.on('error', (error) => {
    console.error(error)
  })

  client.connect()

  const setCache = async (key, value, expirationInSecond = 1800) => {
    await client.set(key, value, {
      EX: expirationInSecond
    })
  }

  const getCache = async (key) => {
    const result = await client.get(key)

    if (result === null) throw new ClientError('Cache tidak ditemukan')

    return result
  }

  const deleteCache = (key) => {
    return client.del(key)
  }

  return {
    setCache,
    getCache,
    deleteCache
  }
}
