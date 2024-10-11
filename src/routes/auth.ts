import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/db'
import { User } from '@/db/models/user'
import { getJwtToken, verifyPassword } from '@/utils/helper'
import { VerifyCode } from '@/db/models/verify-code'
import { jwtAuth } from '@/middlewares/auth'
import { CLIENT_ID, OAUTH_REDIRECT_URL } from '@/env'
import { createAccessCode } from '@/services/code'

type Variables = {
    redirect_uri: string
}

const app = new Hono<{ Variables: Variables }>()

// 账号密码登录
app.post('/login', async (c) => {
    const { username, password } = await c.req.json()
    const repository = (await getDataSource()).getRepository(User)
    const user = await repository
        .createQueryBuilder('user')
        .where({
            username,
        })
        .addSelect('user.password')
        .getOne()
    if (!user) {
        throw new HTTPException(400, { message: '用户名或密码错误！' })
    }
    if (!await verifyPassword(user.password, password)) {
        throw new HTTPException(400, { message: '用户名或密码错误！' })
    }
    const token = await getJwtToken({ id: user.id })
    return c.json({
        message: '登录成功',
        data: token,
    })
})

// 第三方登录时，请求该接口校验验证码是否有效
app.post('/loginByCode', async (c) => {
    const { code } = await c.req.json()
    const scene = 'login'
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOneBy({ code, scene, used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) })
    if (code !== verifyCode?.code) {
        throw new HTTPException(400, { message: '验证码错误' })
    }
    verifyCode.used = true
    await verifyCodeRepository.save(verifyCode)
    // 查找用户信息
    const userId = verifyCode.userId
    const token = await getJwtToken({ id: userId })
    return c.json({
        message: '验证码正确',
        data: token,
    })
})

// 登录通过后，回调 OAUTH_REDIRECT_URL
app.post('/loginByOAuth', async (c) => {
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
    if (redirect_uri) {
        c.set('redirect_uri', redirect_uri)
    }
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

    // 如果 redirectUri 是 OAUTH_REDIRECT_URL 的子域名，就使用 redirectUri，否则使用 OAUTH_REDIRECT_URL
    const url = redirect_uri?.startsWith(OAUTH_REDIRECT_URL) ? new URL(redirect_uri) : new URL(OAUTH_REDIRECT_URL)
    url.search = query.toString()
    const redirectUrl = url.toString()
    return c.redirect(redirectUrl, 302)
})

// 根据授权码获取获取 accessToken，本接口仅建议在后端调用
app.post('/getAccessToken', async (c) => {
    const { code, grant_type, redirect_uri, client_id, client_secret, scope } = await c.req.json()
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
    if (client_id !== CLIENT_ID) {
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

// 使用 jwt token 获取用户信息
app.get('/me', jwtAuth, async (c) => {
    const payload = c.get('jwtPayload')
    const id = payload.id
    const repository = (await getDataSource()).getRepository(User)
    const user = await repository.findOne({ where: { id } })
    return c.json(user)
})

export default app
