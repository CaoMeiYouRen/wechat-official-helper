import { Hono } from 'hono'
import { FC } from 'hono/jsx'
import { Layout } from '@/layout/layout'
import { json2xml, verifyJwtToken } from '@/utils/helper'
import winstonLogger from '@/utils/logger'
import { getDataSource } from '@/db'
import { User } from '@/db/models/user'

const app = new Hono()

type Props = {
    name: string
}
const Welcome: FC<Props> = (props) => {
    return (
        <Layout title="主页">
            <div className="flex items-start justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-center text-gray-800 mt-16">Hello {props.name}!</h1>
            </div>
        </Layout>
    )
}

app.all('/', async (c) => {
    let name = 'Hono'
    const token = c.req.query('token') // 如果有 jwt token，则验证是否有效，如果有效，则查询对应的用户信息
    try {
        if (token) {
            winstonLogger.isDebugEnabled() && winstonLogger.debug('token: ', token)
            const payload = await verifyJwtToken(token)
            const id = payload.id as number
            const userRepository = (await getDataSource()).getRepository(User)
            const user = await userRepository.findOneBy({ id })
            name = user?.username || 'Hono'
        }
    } catch (error) {
        winstonLogger.error(error)
    }
    // 根据 header 判断请求类型
    const accept = c.req.header('Accept')
    // 如果是页面，则返回html
    if (accept.includes('text/html')) {
        c.header('Content-Type', 'text/html')
        return c.html(
            <Welcome name={name} />,
        )
    }
    // 如果是 xml，则返回xml
    if (accept.includes('application/xml') || accept.includes('text/xml')) {
        c.header('Content-Type', 'text/xml')
        return c.text(json2xml({
            message: `Hello ${name}!`,
        }))
    }
    // 其他情况则返回json
    c.header('Content-Type', 'application/json')
    return c.json({
        message: `Hello ${name}!`,
    })
})

export default app
