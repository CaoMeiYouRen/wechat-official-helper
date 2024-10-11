import { Hono } from 'hono'
import { FC, PropsWithChildren } from 'hono/jsx'
import { Layout } from '@/layout/layout'
import { QRCODE_URL } from '@/env'

const app = new Hono()

type Props = PropsWithChildren<{
    client_id: string
    redirect_uri: string
    response_type: string
    scope?: string
    state: string
}>

// 通过验证码登录的前端表单
const OAuthLogin: FC<Props> = (props) => {
    const { client_id, redirect_uri, response_type, scope, state } = props
    return (
        <Layout title="验证码登录">
            <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                <div className="mb-6 text-center">
                    <img src={QRCODE_URL} alt="QR Code" className="mx-auto w-48 h-48 object-contain rounded-lg shadow-lg" />
                    <p className="mt-2 text-sm text-gray-600">
                        请使用微信扫描二维码关注公众号<br />
                        发送文本 <span className="text-red-700 font-semibold">验证码</span> 获取登录验证码。
                    </p>
                </div>
                <form action="/auth/loginByOAuth" method="post">
                    <input type="hidden" name="client_id" value={client_id} />
                    <input type="hidden" name="redirect_uri" value={redirect_uri} />
                    <input type="hidden" name="response_type" value={response_type} />
                    <input type="hidden" name="scope" value={scope} />
                    <input type="hidden" name="state" value={state} />
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">验证码</label>
                        <input type="text" name="code" id="code" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                        登录
                    </button>
                </form>
            </div>
        </Layout>
    )
}
app.get('/', (c) => {
    // 处理 OAuth 登录请求
    const { client_id, redirect_uri, response_type, scope, state } = c.req.query()
    // - `response_type`: 必须。表示授权类型，常用的值有 `code`（授权码模式）和 `token`（隐式授权模式）。
    // - `client_id`: 必须。客户端标识符。
    // - `redirect_uri`: 可选。重定向 URI，用于将用户代理重定向回客户端。
    // - `scope`: 可选。请求的权限范围。
    // - `state`: 推荐。用于防止 CSRF 攻击的随机字符串。
    return c.html(
        <OAuthLogin {...{ client_id, redirect_uri, response_type, scope, state }} />,
    )
})

export default app
