import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
import { __DEV__, TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'
import { errorhandler, notFoundHandler } from './middlewares/error'
import routes from './routes'
import indexPage from './pages/index'
import oauthPage from './pages/oauth'
import errorPage from './pages/error'

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
app.route('/oauth', oauthPage)
app.route('/error', errorPage)
app.route('/', routes)

__DEV__ && showRoutes(app, {
    verbose: true,
})

export default app
