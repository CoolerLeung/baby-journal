# Baby Journal - Server

时光手帐后端服务

## 快速开始

### 1. 启动数据库

```bash
docker compose up -d
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，数据库连接已默认配置好
```

### 3. 安装依赖 & 初始化数据库

```bash
npm install
npx prisma db push    # 创建表结构
npx prisma generate   # 生成 Prisma 客户端
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务运行在 http://localhost:3000

## API 概览

### 认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/auth/me | 获取当前用户信息 |

### 记录
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/records | 时间轴列表（分页） |
| GET | /api/records/:id | 记录详情 |
| POST | /api/records | 新建记录 |
| PUT | /api/records/:id | 编辑记录 |
| DELETE | /api/records/:id | 删除记录 |

### 文件上传
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/upload | 上传媒体文件（最多 10 个） |

## 认证方式

登录后返回 JWT token，后续请求在 Header 中携带：

```
Authorization: Bearer <token>
```

## 常用命令

```bash
npm run dev          # 开发模式（热重载）
npm run build        # 编译 TypeScript
npm run start        # 生产模式运行
npx prisma studio    # 可视化数据库管理
npx prisma db push   # 同步数据库结构
```
