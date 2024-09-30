import { bearerAuth } from 'hono/bearer-auth'
import { ADMIN_KEY } from '@/env'

export const auth = bearerAuth({ token: ADMIN_KEY })
