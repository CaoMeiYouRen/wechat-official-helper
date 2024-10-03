import { handle } from '@hono/node-server/vercel'
import app from './app'
import logger from './utils/logger'

export const runtime = 'nodejs'

export const config = {
    api: {
        bodyParser: false, // 必须禁用，否则 post 请求中的 body 无法解析
    },
}

logger.info('wechat-official-helper 云函数启动成功')

export default handle(app)
