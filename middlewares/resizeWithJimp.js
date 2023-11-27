import Jimp from 'jimp'
import Config from '../config'

export const resaizeImage = async (req, res, next) => {
  try {
    const imageFolderPath = `${Config.userPhotosDir}/${req.dateFolder}`
    const image = await Jimp.read(`${imageFolderPath}/${req.fileName}`)
    image
      .resize(100, 100) // resize
      .quality(80) // set JPEG quality
      .write(`${imageFolderPath}/avatar_${req.fileName}`)
    next()
  } catch (e) {
    console.log(e)
    res.json({
      message: 'unexpected error'
    })
  }
}
