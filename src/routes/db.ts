import { Hono } from 'hono'
import { LessThan } from 'typeorm'
import dayjs from 'dayjs'
import { getDataSource } from '@/db'
import { adminAuth } from '@/middlewares/auth'
import { VerifyCode } from '@/db/models/verify-code'

const app = new Hono()

app.post('/synchronize', adminAuth, async (c) => {
    const dataSource = await getDataSource()
    await dataSource.synchronize()
    return c.json({
        message: 'OK',
    })
})

app.post('/clear', adminAuth, async (c) => {
    // 清理过期的验证码
    const repository = (await getDataSource()).getRepository(VerifyCode)
    // 5 分钟前的验证码都过期了，故可以直接删除
    await repository.delete({ expiredAt: LessThan(dayjs().add(-5, 'minutes').toDate()) })
    return c.json({
        message: 'OK',
    })
})

export default app
