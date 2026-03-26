import type { FastifyInstance } from 'fastify'
import { Prisma } from '@prisma/client'
import { success, paginateMeta } from '../middleware/errorHandler.js'

interface CreateBody {
  date: string               // ISO 日期字符串，如 "2026-03-20T10:00:00Z"
  title: string              // memo 第一行
  memo?: string              // 富文本内容
  mediaType?: 'PHOTO' | 'VIDEO'
  mediaIds?: string[]        // 已上传的媒体文件 ID
}

interface UpdateBody {
  date?: string
  title?: string
  memo?: string
  mediaType?: 'PHOTO' | 'VIDEO'
  mediaIds?: string[]        // 替换所有媒体文件
}

export async function recordRoutes(app: FastifyInstance) {
  /**
   * GET /api/records
   * 获取时间轴列表（分页）
   *
   * Query: ?page=1&pageSize=20
   * 按拍摄日期倒序，返回记录 + 封面媒体
   */
  app.get('/', async (request, reply) => {
    const userId = request.userId!
    const { page = '1', pageSize = '20' } = request.query as { page?: string; pageSize?: string }
    const p = Math.max(1, Number(page))
    const size = Math.min(50, Math.max(1, Number(pageSize)))
    const skip = (p - 1) * size

    const [records, total] = await Promise.all([
      app.prisma.record.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        skip,
        take: size,
        include: {
          media: {
            where: { isCover: true },
            take: 1,
          },
        },
      }),
      app.prisma.record.count({ where: { userId } }),
    ])

    return reply.send(success(
      records.map(r => ({
        id: r.id,
        date: r.date,
        title: r.title,
        memo: r.memo,
        mediaType: r.mediaType,
        cover: r.media[0] || null,   // 封面图
        createdAt: r.createdAt,
      })),
      paginateMeta(total, p, size)
    ))
  })

  /**
   * GET /api/records/:id
   * 获取单条记录详情（含所有媒体文件）
   */
  app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = request.userId!
    const { id } = request.params

    const record = await app.prisma.record.findFirst({
      where: { id, userId },
      include: {
        media: { orderBy: { sort: 'asc' } },
      },
    })

    if (!record) {
      return reply.status(404).send({ ok: false, error: '记录不存在' })
    }

    return reply.send(success(record))
  })

  /**
   * POST /api/records
   * 新建记录
   */
  app.post<{ Body: CreateBody }>('/', async (request, reply) => {
    const userId = request.userId!
    const { date, title, memo = '', mediaType = 'PHOTO', mediaIds = [] } = request.body

    if (!title?.trim()) {
      return reply.status(400).send({ ok: false, error: '标题不能为空' })
    }
    if (!date) {
      return reply.status(400).send({ ok: false, error: '日期不能为空' })
    }

    const record = await app.prisma.record.create({
      data: {
        userId,
        date: new Date(date),
        title: title.trim(),
        memo,
        mediaType,
        media: mediaIds.length > 0 ? {
          create: mediaIds.map((mediaId, index) => ({
            id: mediaId,
            sort: index,
            isCover: index === 0,
          })),
        } : undefined,
      },
      include: { media: { orderBy: { sort: 'asc' } } },
    })

    // 更新媒体表的 recordId（文件已通过 /api/upload 预上传）
    // 这里用 create 方式关联，需要在 upload 时就创建 media 记录
    // 或者改为在 upload 后传 mediaIds 来关联

    return reply.status(201).send(success(record))
  })

  /**
   * PUT /api/records/:id
   * 编辑记录
   */
  app.put<{ Params: { id: string }; Body: UpdateBody }>('/:id', async (request, reply) => {
    const userId = request.userId!
    const { id } = request.params
    const { date, title, memo, mediaType, mediaIds } = request.body

    // 确认记录属于当前用户
    const existing = await app.prisma.record.findFirst({ where: { id, userId } })
    if (!existing) {
      return reply.status(404).send({ ok: false, error: '记录不存在' })
    }

    const record = await app.prisma.record.update({
      where: { id },
      data: {
        ...(date !== undefined && { date: new Date(date) }),
        ...(title !== undefined && { title: title.trim() }),
        ...(memo !== undefined && { memo }),
        ...(mediaType !== undefined && { mediaType }),
      },
      include: { media: { orderBy: { sort: 'asc' } } },
    })

    return reply.send(success(record))
  })

  /**
   * DELETE /api/records/:id
   * 删除记录（同时删除关联的媒体文件记录）
   */
  app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const userId = request.userId!
    const { id } = request.params

    const existing = await app.prisma.record.findFirst({ where: { id, userId } })
    if (!existing) {
      return reply.status(404).send({ ok: false, error: '记录不存在' })
    }

    // Cascade 删除会自动清理 media 记录
    // 实际文件清理在上层逻辑处理（或定时任务）
    await app.prisma.record.delete({ where: { id } })

    return reply.send(success({ deleted: true }))
  })
}
