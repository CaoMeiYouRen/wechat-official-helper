import { Hono } from 'hono'
import { getDataSource } from '@/db'
import { BaseMessage } from '@/db/models/base'
// TODO：添加权限验证
const app = new Hono()
// 获取所有消息
app.get('/', async (c) => {
    const entityManager = (await getDataSource()).manager
    const [list, count] = await entityManager.findAndCount(BaseMessage, { where: {} })
    return c.json({ list, count })
})
// 获取单个消息
app.get('/:id', async (c) => {
    const id = parseInt(c.req.param('id'))
    const entityManager = (await getDataSource()).manager
    const message = await entityManager.findOne(BaseMessage, { where: { id } })
    return c.json(message)
})

export default app
