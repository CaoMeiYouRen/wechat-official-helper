import { Hono } from 'hono'
import eventRoute from './event'
import messageRoute from './message'
import codeRoute from './code'
import userRoute from './user'
import authRoute from './auth'
import dbRoute from './db'
import ruleRoute from './rule'

const app = new Hono()

app.route('/event', eventRoute)

app.route('/auth', authRoute)

app.route('/db', dbRoute)

app.route('/message', messageRoute)

app.route('/code', codeRoute)

app.route('/user', userRoute)

app.route('/rule', ruleRoute)

export default app
