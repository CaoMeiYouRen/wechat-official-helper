import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
import { __DEV__, TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'
import routes from './routes'
import { errorhandler, notFoundHandler } from './middlewares/error'
import indexPage from './pages/index'

const app = new Hono()

app.use(logger((str: string, ...rest: string[]) => {
    winstonLogger.info(str, ...rest)
}))
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders())

app.onError(errorhandler)
app.notFound(notFoundHandler)

app.route('/', indexPage)
app.route('/', routes)

__DEV__ && showRoutes(app, {
    verbose: true,
})

export default app
