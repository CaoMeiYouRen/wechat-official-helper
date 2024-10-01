import { bearerAuth } from 'hono/bearer-auth'
import { jwt } from 'hono/jwt'
import { ADMIN_KEY, JWT_SECRET } from '@/env'

export const adminAuth = bearerAuth({ token: ADMIN_KEY })

export const jwtAuth = jwt({
    secret: JWT_SECRET,
    alg: 'HS512',
})
