import crypto from 'crypto'
import { camelCase, upperFirst } from 'lodash-es'
import xml2js from 'xml2js'
import { Equal, Like, ILike, Between, In } from 'typeorm'
import argon2 from 'argon2'
import { CamelCaseObject, PascalCaseObject } from '@/interfaces/utils'

export function sha1(str: string) {
    return crypto.createHash('sha1').update(str).digest('hex')
}

export function json2xml(obj: any) {
    const builder = new xml2js.Builder({ rootName: 'xml' })
    return builder.buildObject(obj)
}

export async function xml2json(str: string) {
    const parser = new xml2js.Parser({
        normalize: true, // 修剪文本节点内的空白。
        normalizeTags: false, // 将所有标记名规范化为小写。
        explicitArray: false, // 如果为真，总是将子节点放在数组中;否则，只有存在多个数组时才会创建数组
        explicitRoot: false, // 是否需要根节点
    })
    return parser.parseStringPromise(str)
}

/**
 * 将所有字段名转换为小驼峰命名
 * @param obj
 * @returns
 */
export function toCamelCase<T>(obj: T): CamelCaseObject<T> {
    const result: any = {}

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelCaseKey = camelCase(key)
            result[camelCaseKey] = obj[key]
            delete obj[key]
        }
    }

    return result
}

/**
 * 将对象的字段名转换为大驼峰命名
 * @param obj
 * @returns
 */
export function toPascalCase<T>(obj: T): PascalCaseObject<T> {
    const result: any = {}

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const pascalCaseKey = upperFirst(camelCase(key))
            result[pascalCaseKey] = obj[key]
            delete obj[key]
        }
    }

    return result
}

// 支持 传入的操作符
const QUERY_MAP = {
    Equal, Like, ILike, Between, In,
}

/**
 * 转换 query 为真实的操作符
 *
 * @author CaoMeiYouRen
 * @date 2024-04-08
 * @export
 * @param [where]
 */
export function transformQueryOperator(where?: Record<string, any>) {
    return Object.fromEntries(Object.entries(where)
        .map(([key, value]) => {
            if (['string', 'number', 'boolean'].includes(typeof value)) { // 如果是基础类型，则原样返回
                return [key, value]
            }
            if (value?.$op && QUERY_MAP[value.$op]) { // 转换为真实的操作符
                if (value.$op === 'Between') {
                    return [key, QUERY_MAP[value.$op](value.value?.[0], value.value?.[1])]
                }
                return [key, QUERY_MAP[value.$op](value.value)]
            }
            return [key, value]
        }),
    )
}

export async function hashPassword(password: string) {
    return argon2.hash(password)
}

export async function verifyPassword(hash: string, password: string) {
    return argon2.verify(hash, password)
}
