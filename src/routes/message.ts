import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { merge, uniq } from 'lodash-es'
import { getDataSource } from '@/db'
import { BaseMessage } from '@/db/models/wechat-base'
import { adminAuth } from '@/middlewares/auth'
import { CrudQuery } from '@/interfaces/crud-query'
import { transformQueryOperator } from '@/utils/helper'

// message 接口需要 admin 权限
const app = new Hono()

app.use('/*', adminAuth)

// 获取所有消息
app.get('/', async (c) => {
    const query = c.req.query() as CrudQuery
    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1
    const skip = Number(query.skip) || (page - 1) * limit
    const { where = {}, sort = {}, select = [], relations = [] } = query
    const repository = (await getDataSource()).getRepository(BaseMessage)
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

// 获取单个消息
app.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(BaseMessage)
    const message = await repository.findOne({ where: { id } })
    return c.json(message)
})

// 删除单个消息
app.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(BaseMessage)
    const message = await repository.findOne({ where: { id } })
    if (!message) {
        throw new HTTPException(404, { message: '消息不存在' })
    }
    await repository.delete({ id })
    return c.json({ message: '删除成功' })
})

export default app
