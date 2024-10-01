import { Hono } from 'hono'
import { FC } from 'hono/jsx'
import { html } from 'hono/html'
import { Layout } from '@/layout/layout'
import { json2xml } from '@/utils/helper'

const app = new Hono()

const Welcome: FC = () => {
    return (
        <Layout>
            <h1 align="center">Hello! Hono!</h1>
        </Layout>
    )
}

app.all('/', (c) => {
    // 根据 header 判断请求类型
    const accept = c.req.header('Accept')
    // 如果是页面，则返回html
    if (accept.includes('text/html')) {
        c.header('Content-Type', 'text/html')
        return c.html(
            <Welcome />,
        )
    }
    // 如果是 xml，则返回xml
    if (accept.includes('application/xml') || accept.includes('text/xml')) {
        c.header('Content-Type', 'text/xml')
        return c.text(json2xml({
            message: 'Hello Hono!',
        }))
    }
    // 其他情况则返回json
    c.header('Content-Type', 'application/json')
    return c.json({
        message: 'Hello Hono!',
    })
})

export default app
