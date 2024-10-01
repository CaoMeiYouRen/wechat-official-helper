import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { merge, uniq } from 'lodash-es'
import { getDataSource } from '@/db'
import { VerifyCode } from '@/db/models/verify-code'
import { adminAuth } from '@/middlewares/auth'
import { CrudQuery } from '@/interfaces/crud-query'
import { transformQueryOperator } from '@/utils/helper'
// 验证码路由
const app = new Hono()

app.use('/*', adminAuth)

// 获取所有验证码
app.get('/', async (c) => {
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
app.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const message = await repository.findOne({ where: { id } })
    return c.json(message)
})

// 删除单个验证码
app.delete('/:id', async (c) => {
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
