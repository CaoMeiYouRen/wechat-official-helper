import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/db'
import { VerifyCode } from '@/db/models/verify-code'
import { User } from '@/db/models/user'
// 验证码路由
const app = new Hono()

// 第三方登录时，请求该接口校验验证码是否有效
app.post('/verify', async (c) => {
    const { code } = await c.req.json()
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOneBy({ code, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) })
    if (code !== verifyCode.code) {
        throw new HTTPException(400, { message: '验证码错误' })
    }
    // 查找用户信息
    const wechatOpenid = verifyCode.wechatOpenid
    const userRepository = (await getDataSource()).getRepository(User)
    const user = await userRepository.findOneBy({ wechatOpenid })
    return c.json({
        message: '验证码正确',
        data: user,
    })
})

export default app
