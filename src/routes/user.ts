import { Hono } from 'hono'
import { merge, uniq } from 'lodash-es'
import { HTTPException } from 'hono/http-exception'
import { auth } from '@/middlewares/auth'
import { getDataSource } from '@/db'
import { User } from '@/db/models/user'
import { CrudQuery } from '@/interfaces/crud-query'
import { transformQueryOperator } from '@/utils/helper'

const app = new Hono()

// user 接口需要 admin 权限
app.use('/*', auth)

// 获取所有用户
app.get('/', async (c) => {
    const query = c.req.query() as CrudQuery
    const limit = Number(query.limit) || 10
    const page = Number(query.page) || 1
    const skip = Number(query.skip) || (page - 1) * limit
    const { where = {}, sort = {}, select = [], relations = [] } = query
    const repository = (await getDataSource()).getRepository(User)
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

// 获取单个用户
app.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(User)
    const user = await repository.findOne({ where: { id } })
    return c.json(user)
})

// 更新单个用户
app.put('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const body = await c.req.json()
    const repository = (await getDataSource()).getRepository(User)
    const user = await repository.findOne({ where: { id } })
    if (!user) {
        throw new HTTPException(404, { message: '用户不存在' })
    }
    await repository.update({ id }, body)
    return c.json({ message: '更新成功' })
})

// 删除单个用户
app.delete('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const repository = (await getDataSource()).getRepository(User)
    const message = await repository.findOne({ where: { id } })
    if (!message) {
        throw new HTTPException(404, { message: '用户不存在' })
    }
    await repository.delete({ id })
    return c.json({ message: '删除成功' })
})

export default app
