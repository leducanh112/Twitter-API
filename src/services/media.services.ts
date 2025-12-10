import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enums'
import { Media } from '~/models/Others'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import fsPromises from 'fs/promises'
import { uploadFileToS3 } from '~/utils/s3'
import mime from 'mime'

config()
class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullFileName)
        await sharp(file.filepath).jpeg().toFile(newPath)
        const s3result = await uploadFileToS3({
          filename: `images/${newFullFileName}`,
          filepath: newPath,
          contentType: mime.getType(newPath) || 'image/jpeg'
        })
        await Promise.all([fsPromises.unlink(file.filepath), fsPromises.unlink(newPath)])
        return {
          url: s3result.Location,
          type: MediaType.Image
        }
        // return {
        //   url: isProduction
        //     ? `${process.env.HOST}/static/image/${newFullFileName}`
        //     : `http://localhost:${process.env.PORT}/static/image/${newFullFileName}`,
        //   type: MediaType.Image
        // }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const newFilename = files[0].newFilename
    const s3Result = await uploadFileToS3({
      filename: `videos/${newFilename}`,
      filepath: files[0].filepath,
      contentType: mime.getType(files[0].filepath) || 'video/*'
    })
    return {
      url: s3Result.Location,
      type: MediaType.Video
    }
  }

  //   return {
  //     url: isProduction
  //       ? `${process.env.HOST}/static/video/${newFilename}`
  //       : `http://localhost:${process.env.PORT}/static/video/${newFilename}`,
  //     type: MediaType.Video
  //   }
  // }
  async uploadVideoHLS(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await encodeHLSWithMultipleVideoStreams(file.filepath)
        const newName = getNameFromFullName(file.newFilename)
        await fsPromises.unlink(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}`
            : `http://localhost:${process.env.PORT}/static/video-hls/${newName}`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
}

const mediaService = new MediaService()

export default mediaService
