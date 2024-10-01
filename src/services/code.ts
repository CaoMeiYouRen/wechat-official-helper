import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/db'
import { SceneType, VerifyCode } from '@/db/models/verify-code'

/**
 * 生成验证码
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @param [length=6] {number} 验证码长度
 */
export function generateCode(length: number = 6): string {
    let code = ''
    for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10)
    }
    return code
}

/**
 * 创建新的验证码
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @param wechatOpenid
 */
export async function createVerifyCode(wechatOpenid: string, scene: SceneType) {
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = new VerifyCode()
    verifyCode.scene = scene
    verifyCode.wechatOpenid = wechatOpenid
    for (let i = 0; i < 3; i++) {
        verifyCode.code = generateCode()
        // 检查生成的验证码是否重复
        const existCode = await repository.findOneBy({ code: verifyCode.code, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) })
        if (!existCode) { // 不重复则跳出循环
            break
        }
        verifyCode.code = generateCode()
    }
    verifyCode.expiredAt = dayjs().add(5, 'minutes').toDate() // 5 分钟后过期
    return repository.save(verifyCode)
}

