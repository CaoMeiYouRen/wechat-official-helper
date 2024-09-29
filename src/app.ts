import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { __DEV__, TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'
import { event } from './routes/event'
import { getDataSource } from './db'

const app = new Hono()

app.use(logger((str: string, ...rest: string[]) => {
    winstonLogger.info(str, ...rest)
}))
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders())

app.onError((error, c) => {
    const message = process.env.NODE_ENV === 'production' ? `${error.name}: ${error.message}` : error.stack
    let status = 500
    let statusText = 'INTERNAL_SERVER_ERROR'
    if (error instanceof HTTPException) {
        const response = error.getResponse()
        status = response.status
        statusText = response.statusText
    }
    const method = c.req.method
    const requestPath = c.req.path
    winstonLogger.error(`Error in ${method} ${requestPath}: \n${message}`)
    return c.json({
        status,
        statusText,
        message,
    }, status as StatusCode)
})

app.notFound((c) => {
    const method = c.req.method
    const requestPath = c.req.path
    const message = `Cannot ${method} ${requestPath}`
    winstonLogger.warn(message)
    return c.json({
        status: 404,
        statusText: 'Not Found',
        message,
    }, 404)
})

app.all('/', (c) => c.json({
    message: 'Hello Hono!',
}))

app.route('/event', event)

__DEV__ && app.post('/synchronize', async (c) => {
    const dataSource = await getDataSource()
    await dataSource.synchronize()
    return c.json({
        message: 'OK',
    })
})

export default app
