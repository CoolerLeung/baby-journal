import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

/**
 * 鉴权中间件
 * - /api/auth 路径不需要 token（登录/注册）
 * - 其他 /api/** 路径需要在 Header 带 Authorization: Bearer <token>
 */
export async function authHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 登录/注册接口跳过
  if (request.url.startsWith('/api/auth')) return

  // 非接口跳过
  if (!request.url.startsWith('/api/')) return

  try {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return reply.status(401).send({ ok: false, error: '未登录，请先登录' })
    }

    const token = auth.slice(7)
    // 验证 token 并解出 userId
    const decoded = await request.jwt.verify<{ sub: string }>(token)
    request.userId = decoded.sub
  } catch {
    return reply.status(401).send({ ok: false, error: '登录已过期，请重新登录' })
  }
}
