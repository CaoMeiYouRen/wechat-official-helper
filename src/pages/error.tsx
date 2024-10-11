import { Hono } from 'hono'
import { PropsWithChildren, FC } from 'hono/jsx'
import { StatusCode } from 'hono/utils/http-status'

const app = new Hono()

type Props = PropsWithChildren<{
    status: string | number
    error?: string
    error_description?: string
}>

const ErrorPage: FC<Props> = (props) => {
    const { status, error, error_description } = props

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mt-4">{status}</h1>
                <p className="mt-2 text-lg text-gray-600">{error}</p>
                <p className="mt-2 text-lg text-gray-600">{error_description}</p>
            </div>
        </div>
    )
}

app.get('/', (c) => {
    const { status = 400, error, error_description } = c.req.query()
    return c.html(
        <ErrorPage {...{ status, error, error_description }} />,
        Number(status) as StatusCode,
    )
})

export default app
