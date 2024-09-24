import crypto from 'crypto'
import { camelCase, upperFirst } from 'lodash-es'
import xml2js from 'xml2js'
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
