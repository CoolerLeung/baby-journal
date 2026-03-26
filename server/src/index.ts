import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { PrismaClient } from '@prisma/client'
import { authRoutes } from './routes/auth.js'
import { recordRoutes } from './routes/records.js'
import { uploadRoutes } from './routes/upload.js'
import { errorHandler } from './middleware/errorHandler.js'
import { authHook } from './middleware/auth.js'

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

// 全局挂载 prisma
app.decorate('prisma', prisma)

// 插件注册
app.register(cors, { origin: true, credentials: true })
app.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret' })
app.register(multipart, {
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
    files: 10,
  },
})

// 全局错误处理
app.setErrorHandler(errorHandler)

// 鉴权钩子 - 所有 /api/** 路由（除了 auth）都需要 token
app.addHook('onRequest', authHook)

// 注册路由
app.register(authRoutes, { prefix: '/api/auth' })
app.register(recordRoutes, { prefix: '/api/records' })
app.register(uploadRoutes, { prefix: '/api/upload' })

// 健康检查
app.get('/health', async () => ({ status: 'ok' }))

// 启动
const start = async () => {
  const port = Number(process.env.PORT) || 3000
  try {
    await app.listen({ port, host: '0.0.0.0' })
    console.log(`🚀 Baby Journal server running on http://localhost:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

// 优雅关闭
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  await app.close()
  process.exit(0)
})
