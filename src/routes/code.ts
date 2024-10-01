import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { merge, uniq } from 'lodash-es'
import { getDataSource } from '@/db'
import { VerifyCode } from '@/db/models/verify-code'
import { User } from '@/db/models/user'
import { auth } from '@/middlewares/auth'
import { CrudQuery } from '@/interfaces/crud-query'
import { transformQueryOperator } from '@/utils/helper'
// 验证码路由
const app = new Hono()

// 第三方登录时，请求该接口校验验证码是否有效
app.post('/verify', async (c) => {
    const { code, scene } = await c.req.json()
    const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = await verifyCodeRepository.findOneBy({ code, scene, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) })
    if (code !== verifyCode?.code) {
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

// 获取所有验证码
app.get('/', auth, async (c) => {
    const query = c.req.query() as CrudQuery
    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1
    const skip = Number(query.skip) || (page - 1) * limit
    const { where = {}, sort = {}, select = [], relations = [] } = query
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const [data, total] = await repository.findAndCount({
        where: {
            ...transformQueryOperator(where),
        },
        skip,
        take: limit,
        order: merge({
            createdAt: 'DESC',
        }, sort),
        relations: uniq([...relations]),
        select: uniq([...select || []]) as any,
    })

    return c.json({
        data,
        total,
        lastPage: Math.ceil(total / limit),
        currentPage: page,
    })
})

// 获取单个验证码
app.get('/:id', auth, async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const message = await repository.findOne({ where: { id } })
    return c.json(message)
})

// 删除单个验证码
app.delete('/:id', auth, async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const message = await repository.findOne({ where: { id } })
    if (!message) {
        throw new HTTPException(404, { message: '验证码不存在' })
    }
    await repository.delete({ id })
    return c.json({ message: '删除成功' })
})

export default app
