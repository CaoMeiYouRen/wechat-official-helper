import dotenv from 'dotenv'
const result = dotenv.config({
    path: [
        '.env.local',
        '.env',
    ],
})
const envObj = result.parsed

if (process.env.NODE_ENV === 'development') {
    console.log('envObj', envObj)
}

export const __PROD__ = process.env.NODE_ENV === 'production'
export const __DEV__ = process.env.NODE_ENV === 'development'

export const PORT = parseInt(process.env.PORT) || 3000

// 是否写入日志到文件
export const LOGFILES = process.env.LOGFILES === 'true'

export const TIMEOUT = parseInt(process.env.TIMEOUT) || 30000

// 微信公众号相关配置
export const WX_TOKEN = process.env.WX_TOKEN || ''
export const WX_APP_ID = process.env.WX_APP_ID || ''
export const WX_APP_SECRET = process.env.WX_APP_SECRET || ''

// 数据库配置
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''
