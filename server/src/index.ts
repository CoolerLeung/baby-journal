import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { PrismaClient } from '@prisma/client'
import { authRoutes } from './routes/auth.js'
import { recordRoutes } from './routes/records.js'
import { uploadRoutes } from './routes/upload.js'
import { errorHandler } from './middleware/errorHandler.js'

const prisma = new PrismaClient()

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof PrismaClient
  }
  interface FastifyRequest {
    userId?: string
  }
}

const app = Fastify({ logger: true })

app.decorate('prisma', prisma)

app.register(cors, { origin: true, credentials: true })
app.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret' })
app.register(multipart, {
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
    files: 10,
  },
})

app.setErrorHandler(errorHandler)

// 鉴权中间件 - 使用 app.ready() 之后注册确保插件就绪
app.addHook('preHandler', async (request, reply) => {
  if (request.url.startsWith('/api/auth/register') || request.url.startsWith('/api/auth/login')) return
  if (!request.url.startsWith('/api/')) return

  try {
    const auth = request.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      return reply.status(401).send({ ok: false, error: '未登录，请先登录' })
    }
    const decoded = await app.jwt.verify<{ sub: string }>(auth.slice(7))
    request.userId = decoded.sub
  } catch {
    return reply.status(401).send({ ok: false, error: '登录已过期，请重新登录' })
  }
})

app.register(authRoutes, { prefix: '/api/auth' })
app.register(recordRoutes, { prefix: '/api/records' })
app.register(uploadRoutes, { prefix: '/api/upload' })

app.get('/health', async () => ({ status: 'ok' }))

const start = async () => {
  const port = Number(process.env.PORT) || 3001
  try {
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Baby Journal server running on http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  await app.close()
  process.exit(0)
})
