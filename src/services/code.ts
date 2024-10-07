import dayjs from 'dayjs'
import { MoreThanOrEqual } from 'typeorm'
import { getDataSource } from '@/db'
import { SceneType, VerifyCode } from '@/db/models/verify-code'
import { generateCode, generateRandomString } from '@/utils/helper'
import { User } from '@/db/models/user'

/**
 * 创建新的验证码
 *
 * @author CaoMeiYouRen
 * @date 2024-10-01
 * @export
 * @param wechatOpenid
 */
export async function createVerifyCode(user: User, scene: SceneType) {
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = new VerifyCode()
    verifyCode.scene = scene
    verifyCode.userId = user.id
    verifyCode.used = false
    for (let i = 0; i < 3; i++) {
        verifyCode.code = generateCode(6)
        // 检查生成的验证码是否重复
        const existCode = await repository.findOneBy({ code: verifyCode.code, expiredAt: MoreThanOrEqual(dayjs().add(-5, 'minutes').toDate()) })
        if (!existCode) { // 不重复则跳出循环
            break
        }
        verifyCode.code = generateCode(6)
    }
    verifyCode.expiredAt = dayjs().add(5, 'minutes').toDate() // 5 分钟后过期
    return repository.save(verifyCode)
}

/**
 * 生成访问码
 *
 * @author CaoMeiYouRen
 * @date 2024-10-07
 * @export
 * @param user
 */
export async function createAccessCode(user: User) {
    const repository = (await getDataSource()).getRepository(VerifyCode)
    const verifyCode = new VerifyCode()
    verifyCode.scene = 'access-code'
    verifyCode.userId = user.id
    verifyCode.used = false
    verifyCode.code = generateRandomString(32)
    verifyCode.expiredAt = dayjs().add(5, 'minutes').toDate() // 5 分钟后过期
    return repository.save(verifyCode)
}
