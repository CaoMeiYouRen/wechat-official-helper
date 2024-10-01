import { Hono } from 'hono'
import { getDataSource } from '@/db'
import { adminAuth } from '@/middlewares/auth'

const app = new Hono()

app.post('/synchronize', adminAuth, async (c) => {
    const dataSource = await getDataSource()
    await dataSource.synchronize()
    return c.json({
        message: 'OK',
    })
})

export default app
