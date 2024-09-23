import crypto from 'crypto'
import xml2js from 'xml2js'

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
