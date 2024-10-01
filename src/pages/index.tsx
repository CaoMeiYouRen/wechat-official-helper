/** @jsx jsx */
/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
import { FC, jsx } from 'hono/jsx'

const app = new Hono()

const Layout: FC = (props) => {
    return (
        <html>
            <head>
                <title>Welcome to Hono</title>
            </head>
            <body>{props.children}</body>
        </html>
    )
}

const Welcome: FC = () => {
    return (
        <Layout>
            <h1 align="center">wechat-official-helper</h1>
            <p>
                一个基于 Hono 实现的云函数版本的微信公众号助手，支持个人非认证公众号的上行登录、用户消息存储等功能。
            </p>
        </Layout>
    )
}

app.get('/', (c) => {
    return c.html(<Welcome />)
})

export default app
