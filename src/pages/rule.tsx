import { Hono } from 'hono'
import { FC } from 'hono/jsx'
import { Layout } from '@/layout/layout'

const app = new Hono()

// 管理 Rule 的页面
// 实现 CRUD
const RulePage: FC = () => {
    return (
        <Layout>
            <h1 align="center">管理规则</h1>
        </Layout>
    )
}

app.get('/', (c) => {
    return c.html(<RulePage />)
})

export default app
