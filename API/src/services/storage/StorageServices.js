const fs = require('fs')
const uuid = require('uuid')

exports.StorageServices = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }

  const writeFile = (file, meta) => {
    const filename = `${uuid.v4()}.${meta.filename.split('.').pop()}`
    const path = `${folder}/${filename}`
    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', (err) => reject(err))
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }

  const deleteFile = (filename) => {
    const path = `${folder}/${filename.split('/').pop()}`

    fs.unlink(path, (err) => {
      if (err) throw err
    })
  }

  return {
    writeFile,
    deleteFile
  }
}
