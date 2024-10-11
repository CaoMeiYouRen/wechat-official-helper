import { Hono } from 'hono'
import { FC, PropsWithChildren } from 'hono/jsx'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { Layout } from '@/layout/layout'
import { CLIENT_ID, CLIENT_SECRET, OAUTH_ALLOWED_REDIRECT_URLS, OAUTH_REDIRECT_URL, QRCODE_URL } from '@/env'
import { getDataSource } from '@/db'
import { VerifyCode } from '@/db/models/verify-code'
import { getJwtToken } from '@/utils/helper'
import { createAccessCode } from '@/services/code'

const app = new Hono()

type Props = PropsWithChildren<{
    client_id: string
    redirect_uri: string
    response_type: string
    scope?: string
    state: string
}>

// 通过验证码登录的前端表单
const OAuthLogin: FC<Props> = (props) => {
    const { client_id, redirect_uri, response_type, scope, state } = props
    return (
        <Layout title="验证码登录">
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                <div className="mb-6 text-center">
                    <img src={QRCODE_URL} alt="QR Code" className="mx-auto w-48 h-48 object-contain rounded-lg shadow-lg" />
                    <p className="mt-2 text-sm text-gray-600">
                        请使用微信扫描二维码关注公众号<br />
                        发送文本 <span className="text-red-700 font-semibold">验证码</span> 获取登录验证码。
                    </p>
                </div>
                <form action="/oauth/authorize" method="post">
                    <input type="hidden" name="client_id" value={client_id} />
                    <input type="hidden" name="redirect_uri" value={redirect_uri} />
                    <input type="hidden" name="response_type" value={response_type} />
                    <input type="hidden" name="scope" value={scope} />
                    <input type="hidden" name="state" value={state} />
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">验证码</label>
                        <input type="text" name="code" id="code" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        登录
                    </button>
                </form>
            </div>
        </Layout>
    )
}
app.get('/', (c) => {
    // 处理 OAuth 登录请求
    const { client_id, redirect_uri, response_type, scope, state } = c.req.query()
    // - `response_type`: 必须。表示授权类型，常用的值有 `code`（授权码模式）和 `token`（隐式授权模式）。
    // - `client_id`: 必须。客户端标识符。
    // - `redirect_uri`: 可选。重定向 URI，用于将用户代理重定向回客户端。
    // - `scope`: 可选。请求的权限范围。
    // - `state`: 推荐。用于防止 CSRF 攻击的随机字符串。
    return c.html(
        <OAuthLogin {...{ client_id, redirect_uri, response_type, scope, state }} />,
    )
})

// 登录通过后，回调 OAUTH_REDIRECT_URL
app.post('/authorize', async (c) => {
    // 判断请求类型
    let body = {} as Record<string, string>
    const contentType = c.req.header('Content-Type')
    if (contentType === 'application/x-www-form-urlencoded') {
        body = await c.req.parseBody() as Record<string, string>
    } else if (contentType === 'application/json') {
        body = await c.req.json()
    }
    const { code, client_id, redirect_uri, response_type, scope, state } = body
    // - `code`: 必须。验证码。
    // - `response_type`: 必须。表示授权类型，常用的值有 `code`（授权码模式）和 `token`（隐式授权模式）。
    // - `client_id`: 必须。客户端标识符。
    // - `redirect_uri`: 可选。重定向 URI，用于将用户代理重定向回客户端。
    // - `scope`: 可选。请求的权限范围。
    // - `state`: 推荐。用于防止 CSRF 攻击的随机字符串。
    if (!OAUTH_REDIRECT_URL) {
        return c.json({ error: 'access_denied', error_description: 'OAUTH_REDIRECT_URL 未配置', state }, 400)
    }
    // 检查请求参数
    if (!response_type || !client_id || !state) {
        return c.json({ error: 'invalid_request', error_description: '缺失部分必要的参数', state }, 400)
    }
    if (response_type !== 'code' && response_type !== 'token') {
        return c.json({ error: 'unsupported_response_type', state }, 400)
    }
    if (client_id !== CLIENT_ID) {
        return c.json({ error: 'invalid_client', error_description: '无效的客户端', state }, 400)
    }

    const scene = 'login'
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOne({ where: { code, scene, used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) }, relations: ['user'] })
    if (code !== verifyCode?.code) {
        return c.json({ error: 'access_denied', error_description: '验证码错误', state }, 400)
    }
    verifyCode.used = true
    await verifyCodeRepository.save(verifyCode)
    // 查找用户信息
    const user = verifyCode.user
    const accessCode = await createAccessCode(user)
    // 将授权码返回给客户端
    const query = new URLSearchParams({
        code: accessCode.code,
        state,
    })

    // 如果 redirectUri 是 OAUTH_ALLOWED_REDIRECT_URLS 中任意一个域名 的子域名，就使用 redirectUri，否则使用 OAUTH_REDIRECT_URL
    const url: URL = OAUTH_ALLOWED_REDIRECT_URLS.some((allowedRedirectUrls) => redirect_uri?.startsWith(allowedRedirectUrls)) ? new URL(redirect_uri) : new URL(OAUTH_REDIRECT_URL)

    url.search = query.toString()
    const redirectUrl = url.toString()
    return c.redirect(redirectUrl, 302)
})

// 根据授权码获取获取 accessToken，本接口仅建议在后端调用
app.post('/token', async (c) => {
    // 判断请求类型
    let body = {} as Record<string, string>
    const contentType = c.req.header('Content-Type')
    if (contentType === 'application/x-www-form-urlencoded') {
        body = await c.req.parseBody() as Record<string, string>
    } else if (contentType === 'application/json') {
        body = await c.req.json()
    }
    const { code, grant_type, redirect_uri, client_id, client_secret, scope } = body
    /**
    - `grant_type`: 必须。表示授权类型，常用的值有 `authorization_code`、`password`、`client_credentials` 和 `refresh_token`。
    - `code`: 当 `grant_type=authorization_code` 时必须。授权码。
    - `redirect_uri`: 当 `grant_type=authorization_code` 时必须。重定向 URI，必须与授权请求中的 URI 一致。
    - `client_id`: 当客户端未使用客户端凭据时必须。客户端标识符。
    - `client_secret`: 当客户端使用客户端凭据时必须。客户端密钥。
    - `scope`: 可选。请求的权限范围。
     */
    if (grant_type !== 'authorization_code') {
        return c.json({ error: 'unsupported_grant_type', error_description: '不支持的授权类型' }, 400)
    }
    if (client_id !== CLIENT_ID || client_secret !== CLIENT_SECRET) {
        return c.json({ error: 'invalid_client', error_description: '无效的客户端' }, 400)
    }
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOne({ where: { code, scene: 'access-code', used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) }, relations: ['user'] })
    if (!verifyCode) {
        return c.json({ error: 'invalid_grant', error_description: '授权码无效' }, 400)
    }
    verifyCode.used = true
    await verifyCodeRepository.save(verifyCode)
    // 查找用户信息
    const user = verifyCode.user
    const token = await getJwtToken({ id: user.id })
    return c.json({
        message: '授权码正确',
        access_token: token,
        token_type: 'Bearer',
        expires_in: 7200, // 2 小时有效
    })
})

export default app
