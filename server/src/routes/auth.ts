import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
const { hash, compare } = bcrypt
import { success } from '../middleware/errorHandler.js'

interface RegisterBody {
  phone?: string
  email?: string
  password: string
  nickname?: string
}

interface LoginBody {
  phone?: string
  email?: string
  password: string
}

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /api/auth/register
   * 注册新用户
   *
   * 手机号或邮箱二选一 + 密码
   * 返回 JWT token
   */
  app.post<{ Body: RegisterBody }>('/register', async (request, reply) => {
    const { phone, email, password, nickname } = request.body

    if (!password || password.length < 6) {
      return reply.status(400).send({ ok: false, error: '密码至少 6 位' })
    }
    if (!phone && !email) {
      return reply.status(400).send({ ok: false, error: '手机号或邮箱至少填一个' })
    }

    // 检查是否已注册
    const existing = await app.prisma.user.findFirst({
      where: { OR: phone ? [{ phone }, { email }] : [{ email }] },
    })
    if (existing) {
      return reply.status(409).send({ ok: false, error: '该手机号或邮箱已注册' })
    }

    // 密码加密后存储
    const passwordHash = await hash(password, 10)

    const user = await app.prisma.user.create({
      data: {
        phone,
        email,
        password: passwordHash,
        nickname: nickname || '新用户',
      },
      // 不返回密码
      select: { id: true, phone: true, email: true, nickname: true, avatar: true, createdAt: true },
    })

    // 生成 JWT token，sub 字段存用户 id
    const token = app.jwt.sign({ sub: user.id }, { expiresIn: '30d' })

    return reply.status(201).send(success({ user, token }))
  })

  /**
   * POST /api/auth/login
   * 登录
   *
   * 手机号或邮箱 + 密码
   * 返回 JWT token
   */
  app.post<{ Body: LoginBody }>('/login', async (request, reply) => {
    const { phone, email, password } = request.body

    if (!password) {
      return reply.status(400).send({ ok: false, error: '请输入密码' })
    }
    if (!phone && !email) {
      return reply.status(400).send({ ok: false, error: '请输入手机号或邮箱' })
    }

    const user = await app.prisma.user.findFirst({
      where: { OR: phone ? [{ phone }, { email }] : [{ email }] },
    })

    if (!user || !user.password) {
      return reply.status(401).send({ ok: false, error: '账号或密码错误' })
    }

    const valid = await compare(password, user.password)
    if (!valid) {
      return reply.status(401).send({ ok: false, error: '账号或密码错误' })
    }

    const token = app.jwt.sign({ sub: user.id }, { expiresIn: '30d' })

    return reply.send(success({
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    }))
  })

  /**
   * GET /api/auth/me
   * 获取当前登录用户信息
   * 需要 token
   */
  app.get('/me', async (request, reply) => {
    const userId = request.userId!
    const user = await app.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, phone: true, email: true, nickname: true, avatar: true, createdAt: true },
    })

    if (!user) {
      return reply.status(404).send({ ok: false, error: '用户不存在' })
    }

    return reply.send(success({ user }))
  })
}
