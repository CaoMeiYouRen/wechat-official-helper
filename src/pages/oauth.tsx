import { Hono } from 'hono'
import { FC } from 'hono/jsx'
import { Layout } from '@/layout/layout'

const app = new Hono()

// 通过验证码登录的前端表单
const OAuthLogin: FC = () => {
    return (
        <Layout title="验证码登录">
            <form action="/auth/loginByOAuth" method="post" className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
                <div className="mb-4">
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">验证码</label>
                    <input type="text" name="code" id="code" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    登录
                </button>
            </form>
        </Layout>
    )
}
app.get('/', (c) => {
    return c.html(
        <OAuthLogin />,
    )
})

export default app
