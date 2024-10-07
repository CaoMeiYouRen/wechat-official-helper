import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/db'
import { User } from '@/db/models/user'
import { getJwtToken, verifyPassword } from '@/utils/helper'
import { VerifyCode } from '@/db/models/verify-code'
import { jwtAuth } from '@/middlewares/auth'
import { OAUTH_REDIRECT_URL } from '@/env'
import { createAccessCode } from '@/services/code'

const app = new Hono()

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
    let body = {} as Record<string, any>
    const contentType = c.req.header('Content-Type')
    if (contentType === 'application/x-www-form-urlencoded') {
        body = await c.req.parseBody() as Record<string, any>
    } else if (contentType === 'application/json') {
        body = await c.req.json()
    }
    const { code } = body
    const scene = 'login'
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOne({ where: { code, scene, used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) }, relations: ['user'] })
    if (code !== verifyCode?.code) {
        throw new HTTPException(400, { message: '验证码错误' })
    }
    verifyCode.used = true
    await verifyCodeRepository.save(verifyCode)
    // 查找用户信息
    const user = verifyCode.user
    const accessCode = await createAccessCode(user)
    // 将授权码返回给客户端
    const redirectUrl = `${OAUTH_REDIRECT_URL}?accessCode=${accessCode.code}`
    return c.redirect(redirectUrl, 302)
})

// 根据授权码获取获取 accessToken，本接口仅建议在后端调用
app.post('/getAccessToken', async (c) => {
    const { accessCode } = await c.req.json()
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOne({ where: { code: accessCode, scene: 'access-code', used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) }, relations: ['user'] })
    if (!verifyCode) {
        throw new HTTPException(400, { message: '授权码无效' })
    }
    verifyCode.used = true
    await verifyCodeRepository.save(verifyCode)
    // 查找用户信息
    const user = verifyCode.user
    const token = await getJwtToken({ id: user.id })
    return c.json({
        message: '授权码正确',
        data: token,
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
