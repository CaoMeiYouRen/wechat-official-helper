import { VerifyCode } from '@/db/models/verify-code'
import { createCrudRoute } from '@/utils/route-helper'
// 验证码路由
const app = createCrudRoute({
    name: '验证码',
    model: VerifyCode,
    methods: {
        find: true,
        findOne: true,
        create: false,
        update: false,
        delete: true,
    },
    admin: true,
})

export default app
