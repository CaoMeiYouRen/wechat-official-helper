import { handle } from '@hono/node-server/vercel'
import app from './app'
import logger from './utils/logger'

export const runtime = 'nodejs'

export const config = {
}

logger.info('wechat-official-helper 云函数启动成功')

export default handle(app)
