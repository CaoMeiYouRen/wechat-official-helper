import { Rule } from '@/db/models/rule'
import { createCrudRoute } from '@/utils/route-helper'

const app = createCrudRoute({
    name: '规则',
    model: Rule,
    methods: {
        find: true,
        findOne: true,
        create: true,
        update: true,
        delete: true,
    },
    admin: true,
})

export default app
