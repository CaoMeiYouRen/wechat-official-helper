import { Hono } from 'hono'
import { FC } from 'hono/jsx'
import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { Layout } from '@/layout/layout'
import { generateRandomString, json2xml } from '@/utils/helper'
import winstonLogger from '@/utils/logger'
import { getDataSource } from '@/db'
import { VerifyCode } from '@/db/models/verify-code'
import { CLIENT_ID, OAUTH_REDIRECT_URL } from '@/env'

const app = new Hono()

type Props = {
    name: string
    id: number
}
const Welcome: FC<Props> = (props) => {
    const { name, id } = props
    const isLogin = !!id
    const client_id = CLIENT_ID
    const redirect_uri = OAUTH_REDIRECT_URL
    const response_type = 'code'
    const scope = 'user'
    const state = generateRandomString(16)
    const url = `/oauth?${new URLSearchParams({
        client_id,
        redirect_uri,
        response_type,
        scope,
        state,
    })}`
    return (
        <Layout title="主页">
            <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-16">
                <div className="text-center">
                    <h1 className="text-5xl font-extrabold text-gray-800 mt-4">Hello {name}!</h1>
                    <p className="mt-2 text-lg text-gray-600">欢迎来到 Hono 主页</p>
                </div>
                {isLogin ?
                    <div className="mt-6 text-center text-green-600 font-semibold text-lg">您已登录</div>
                    :
                    <a href={url} className="mt-6 w-full max-w-sm">
                        <button type="button" className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            登录
                        </button>
                    </a>
                }
            </div>
        </Layout>
    )
}

app.all('/', async (c) => {
    let name = 'Hono'
    let id = 0
    try {
        const accessCode = c.req.query('code') // 如果有 code，则验证是否有效，如果有效，则查询对应的用户信息
        if (accessCode) {
            winstonLogger.isDebugEnabled() && winstonLogger.debug(`accessCode: ${accessCode}`)
            // 由于本地就能获取到用户信息，所以不走获取 accessToken 的流程
            // 如果是第三方登录，则要先获取 accessToken，再获取用户信息
            const verifyCodeRepository = (await getDataSource()).getRepository(VerifyCode)
            const verifyCode = await verifyCodeRepository.findOne({ where: { code: accessCode, scene: 'access-code', used: false, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) }, relations: ['user'] })
            const user = verifyCode.user
            name = user?.username || 'Hono'
            id = user?.id || 0
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
            <Welcome name={name} id={id} />,
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
