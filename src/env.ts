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
    // 开发模式下以本地环境变量为准
    // if (getRuntimeKey() === 'edge-light') { // Vercel Edge Functions 模式下以本地环境变量为准
    //     if (Object.keys(envObj).length > 0) {
    //         Object.keys(envObj).forEach((key) => {
    //             env[key] = envObj[key]
    //         })
    //     }
    // }
}

export const __PROD__ = process.env.NODE_ENV === 'production'
export const __DEV__ = process.env.NODE_ENV === 'development'

export const PORT = parseInt(process.env.PORT) || 3000

export const LOG_LEVEL = process.env.LOG_LEVEL || (__DEV__ ? 'silly' : 'http')

// 是否写入日志到文件
export const LOGFILES = process.env.LOGFILES === 'true'

export const TIMEOUT = parseInt(process.env.TIMEOUT) || 30000

// 微信公众号相关配置
export const WX_TOKEN = process.env.WX_TOKEN || ''
export const WX_APP_ID = process.env.WX_APP_ID || ''
export const WX_APP_SECRET = process.env.WX_APP_SECRET || ''

// 数据库配置
export const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || ''

// admin 密钥，通过 Bearer Auth 认证
export const ADMIN_KEY = process.env.ADMIN_KEY || ''

// 基础路径
export const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`

// 重定向地址
export const REDIRECT_URL = process.env.REDIRECT_URL || ''

// 回调地址
export const OAUTH_REDIRECT_URL = process.env.OAUTH_REDIRECT_URL || ''

// jwt 密钥
export const JWT_SECRET = process.env.JWT_SECRET || ''

// 二维码地址
export const QRCODE_URL = process.env.QRCODE_URL || ''

// OAuth2.0 配置
export const CLIENT_ID = process.env.CLIENT_ID || ''
