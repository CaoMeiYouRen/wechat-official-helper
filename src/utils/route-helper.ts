import { Hono } from 'hono'
import { merge, uniq } from 'lodash-es'
import { HTTPException } from 'hono/http-exception'
import { transformQueryOperator } from './helper'
import { CrudQuery } from '@/interfaces/crud-query'
import { adminAuth } from '@/middlewares/auth'
import { getDataSource } from '@/db'

type CurdMethods = 'find' | 'findOne' | 'create' | 'update' | 'delete'

type CrudConfig = {
    // 实体类名称，用于错误提示
    name?: string
    // 实体类
    model: any
    // 要启用的方法
    methods: {
        [key in CurdMethods]: boolean
    }
    // 是否需要管理员权限
    admin?: boolean
}

export function createCrudRoute(config: CrudConfig) {
    const { model, methods, admin, name = 'Object' } = config || {}
    const app = new Hono()

    if (admin !== false) { // 目前不考虑普通用户，所以默认需要管理员权限
        app.use('/*', adminAuth)
    }

    if (methods.find !== false) {
        app.get('/', async (c) => {
            const query = c.req.query() as CrudQuery
            const limit = Number(query.limit) || 10
            const page = Number(query.page) || 1
            const skip = Number(query.skip) || (page - 1) * limit
            const { where = {}, sort = {}, select = [], relations = [] } = query
            const repository = (await getDataSource()).getRepository(model)
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
    }

    if (methods.findOne !== false) {
        app.get('/:id', async (c) => {
            const id = parseInt(c.req.param('id'))
            const repository = (await getDataSource()).getRepository(model)
            const object = await repository.findOne({ where: { id } })
            if (!object) {
                throw new HTTPException(404, { message: `${name}不存在` })
            }
            return c.json(object)
        })
    }

    if (methods.create !== false) {
        app.post('/', async (c) => {
            const body = await c.req.json()
            const repository = (await getDataSource()).getRepository(model)
            const object = await repository.save(repository.create(body))
            return c.json(object)
        })
    }

    if (methods.update !== false) {
        app.put('/:id', async (c) => {
            const id = parseInt(c.req.param('id'))
            const body = await c.req.json()
            const repository = (await getDataSource()).getRepository(model)
            let object = await repository.findOne({ where: { id } })
            if (!object) {
                throw new HTTPException(404, { message: `${name}不存在` })
            }
            body.id = id
            object = await repository.save(repository.create(body))
            return c.json(object)
        })
    }

    if (methods.delete !== false) {
        app.delete('/:id', async (c) => {
            const id = parseInt(c.req.param('id'))
            const repository = (await getDataSource()).getRepository(model)
            const object = await repository.findOne({ where: { id } })
            if (!object) {
                throw new HTTPException(404, { message: `${name}不存在` })
            }
            await repository.delete({ id })
            return c.json({ message: '删除成功' })
        })
    }

    return app
}
