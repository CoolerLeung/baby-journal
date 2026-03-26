import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

/**
 * 错误处理中间件
 * 统一错误格式，隐藏内部错误细节
 */
export async function errorHandler(
  error: Error & { statusCode?: number; validation?: any },
  request: FastifyRequest,
  reply: FastifyReply
) {
  const statusCode = error.statusCode || 500

  // Prisma 常见错误
  if (error.code === 'P2002') {
    return reply.status(409).send({
      ok: false,
      error: '数据已存在（唯一约束冲突）',
    })
  }

  if (error.code === 'P2025') {
    return reply.status(404).send({
      ok: false,
      error: '记录不存在',
    })
  }

  // 请求体验证错误
  if (error.validation) {
    return reply.status(400).send({
      ok: false,
      error: '请求参数错误',
      details: error.validation,
    })
  }

  // 文件过大
  if (error.code === 'FST_PARTS_LIMIT') {
    return reply.status(400).send({ ok: false, error: '文件数量超限，最多上传 10 个' })
  }
  if (error.code === 'FST_FILE_TOO_LARGE') {
    return reply.status(400).send({ ok: false, error: '文件过大' })
  }

  reply.log.error(error)

  return reply.status(statusCode).send({
    ok: false,
    error: statusCode === 500 ? '服务器内部错误' : error.message,
  })
}

/**
 * 统一成功响应格式
 */
export function success(data: any, meta?: any) {
  return { ok: true, data, meta }
}

/**
 * 统一分页元数据
 */
export function paginateMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
