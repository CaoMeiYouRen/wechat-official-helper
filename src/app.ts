import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'
import eventRoute from './routes/event'
import messageRoute from './routes/message'
import codeRoute from './routes/code'
import userRoute from './routes/user'
import authRoute from './routes/auth'
import dbRoute from './routes/db'
import { errorhandler, notFoundHandler } from './middlewares/error'

const app = new Hono()

app.use(logger((str: string, ...rest: string[]) => {
    winstonLogger.info(str, ...rest)
}))
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders())

app.onError(errorhandler)

app.notFound(notFoundHandler)

app.all('/', (c) => c.json({
    message: 'Hello Hono!',
}))
// app.route('/', indexPage)

app.route('/event', eventRoute)

app.route('/auth', authRoute)

app.route('/db', dbRoute)

app.route('/message', messageRoute)

app.route('/code', codeRoute)

app.route('/user', userRoute)

export default app
