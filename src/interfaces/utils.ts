export type CamelCase<S extends string> =
    S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
    : S extends `${infer P1}${infer P2}`
    ? P1 extends Uppercase<P1>
    ? `${Lowercase<P1>}${CamelCase<P2>}`
    : S
    : Lowercase<S>
/**
 * 将字段转换为小驼峰命名
 */
export type CamelCaseObject<T> = {
    [K in keyof T as CamelCase<string & K>]: T[K]
}

export type PascalCase<S extends string> =
    S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Capitalize<Lowercase<P1>>}${Uppercase<P2>}${PascalCase<P3>}`
    : Capitalize<S>
/**
 * 将字段转为大驼峰
 */
export type PascalCaseObject<T> = {
    [K in keyof T as PascalCase<string & K>]: T[K]
}
