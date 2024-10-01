import { User } from '@/db/models/user'
import { createCrudRoute } from '@/utils/route-helper'

const app = createCrudRoute({
    name: '用户',
    model: User,
    methods: {
        find: true,
        findOne: true,
        create: false,
        update: true,
        delete: true,
    },
    admin: true,
})

export default app
