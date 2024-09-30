export interface CrudQuery {
    /**
     * 查询条件
     */
    where?: Record<string, any>
    /**
     * 数量限制
     */
    limit?: number
    /**
     * 页数
     */
    page?: number
    /**
     * 跳过多少页
     */
    skip?: number
    /**
     * 排序
     */
    sort?: any
    /**
     * 要查询的字段
     */
    select?: string | any[]
    /**
     * 要关联其他表关系的字段
     */
    relations?: string[]
}
