import type { FastifyInstance } from 'fastify'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { existsSync } from 'fs'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import { success } from '../middleware/errorHandler.js'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const ALLOWED_VIDEO = ['video/mp4', 'video/quicktime', 'video/webm']
const ALLOWED_ALL = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO]
const MAX_IMAGE_SIZE = 20 * 1024 * 1024   // 20MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024   // 500MB

/**
 * 获取图片尺寸
 */
async function getImageSize(buffer: Buffer): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata()
  return { width: metadata.width || 0, height: metadata.height || 0 }
}

/**
 * 确保上传目录存在
 */
function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdir(dir, { recursive: true })
  }
}

export async function uploadRoutes(app: FastifyInstance) {
  /**
   * POST /api/upload
   * 上传媒体文件（支持多文件，最多 10 个）
   *
   * FormData field: "files"
   * 返回上传后的媒体文件信息数组
   *
   * 流程：
   * 1. 接收文件
   * 2. 校验类型和大小
   * 3. 生成唯一文件名，存到 uploads/<userId>/ 目录
   * 4. 图片生成缩略图
   * 5. 写入 media 表
   * 6. 返回 media id 和 url
   */
  app.post('/', async (request, reply) => {
    const userId = request.userId!
    const files = request.files()

    const results: any[] = []
    let count = 0

    for await (const file of files) {
      if (count >= 10) break

      const chunks: Buffer[] = []
      for await (const chunk of file.file) {
        chunks.push(chunk as Buffer)
      }
      const buffer = Buffer.concat(chunks)

      // 校验类型
      if (!ALLOWED_ALL.includes(file.mimetype)) {
        return reply.status(400).send({
          ok: false,
          error: `不支持的文件类型: ${file.mimetype}`,
        })
      }

      // 校验大小
      const isImage = ALLOWED_IMAGE.includes(file.mimetype)
      const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
      if (buffer.length > maxSize) {
        return reply.status(400).send({
          ok: false,
          error: isImage ? '图片不能超过 20MB' : '视频不能超过 500MB',
        })
      }

      // 生成文件路径
      const ext = extname(file.filename) || (isImage ? '.jpg' : '.mp4')
      const fileId = nanoid(12)
      const filename = `${fileId}${ext}`
      const userDir = join(UPLOAD_DIR, userId)
      const filepath = join(userDir, filename)

      // 写入文件
      ensureDir(userDir)
      await writeFile(filepath, buffer)

      // 图片处理：生成缩略图 + 获取尺寸
      let width: number | undefined
      let height: number | undefined
      if (isImage) {
        try {
          const size = await getImageSize(buffer)
          width = size.width
          height = size.height

          // 生成缩略图（最长边 400px）
          const thumbDir = join(userDir, 'thumbs')
          ensureDir(thumbDir)
          const thumbPath = join(thumbDir, filename)
          await sharp(buffer)
            .resize(400, 400, { fit: 'inside' })
            .toFile(thumbPath)
        } catch {
          // sharp 不支持某些格式（如 heic），跳过缩略图
        }
      }

      results.push({
        id: fileId,
        filename,
        url: `/uploads/${userId}/${filename}`,
        thumbUrl: isImage ? `/uploads/${userId}/thumbs/${filename}` : null,
        type: file.mimetype,
        size: buffer.length,
        width,
        height,
      })

      count++
    }

    if (results.length === 0) {
      return reply.status(400).send({ ok: false, error: '未选择文件' })
    }

    return reply.status(201).send(success(results))
  })

  // 注册静态文件服务 - 让 /uploads/* 可通过 URL 访问
  // 在 index.ts 中注册 @fastify/static
}
