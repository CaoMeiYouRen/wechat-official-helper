import { BaseMessage } from '@/db/models/wechat-base'
import { createCrudRoute } from '@/utils/route-helper'

// message 接口需要 admin 权限
const app = createCrudRoute({
    name: '消息',
    model: BaseMessage,
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
