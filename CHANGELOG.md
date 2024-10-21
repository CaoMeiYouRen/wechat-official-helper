# wechat-official-helper

# 1.0.0 (2024-10-11)


### ⏪ 回退

* 回退 vercel 到 JavaScript ([1009013](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/1009013))


### ♻ 代码重构

* 优化 重定向逻辑 ([34179a6](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/34179a6))
* 修复 错误的微信名称拼写 ([5049111](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/5049111))
* 修改 oauth 相关的路由地址 ([c2ec386](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/c2ec386))
* 修改 消息去重逻辑 ([936a565](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/936a565))
* 修改消息重试逻辑；增加查询 openid 逻辑 ([b3e7b7c](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/b3e7b7c))
* 增加 数据库日志输出 ([1a72999](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/1a72999))
* 完成字段格式的转换工具模块 ([88336ba](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/88336ba))
* 移除不必要的日志输出 ([421afa1](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/421afa1))
* 调整 oauth 的路由 ([3d74f55](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/3d74f55))
* 调整部分页面逻辑 ([80c8fff](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/80c8fff))
* 重构 CRUD 相关逻辑；修改错误处理中间件；增加规则实体类 ([a331d84](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/a331d84))
* 重构 OAuth 登录逻辑，优化 token 传递逻辑 ([f281d16](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/f281d16))
* 重构 增加订阅状态字段；增加响应事件的规则字段；增加 订阅和取消订阅的处理 ([e1736bc](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/e1736bc))


### ✨ 新功能

* 初步完成微信公众号消息存储数据库逻辑 ([8713ead](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/8713ead))
* 增加 client_secret 配置 ([fba91b4](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/fba91b4))
* 增加 OAuth 登录页面；美化页面 ([35c5773](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/35c5773))
* 增加 state 参数，以防止跨站请求伪造 ([210f5a5](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/210f5a5))
* 增加 重定向功能 ([3aaa826](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/3aaa826))
* 完成 OAuth 扫码登录的逻辑；美化 主页/登录页 ([7b00a8a](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/7b00a8a))
* 完成微信公众号对接逻辑 ([ef057b7](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/ef057b7))
* 完成数据表设计，同步实体类和类型声明 ([d9d2a1c](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/d9d2a1c))
* 新增 OAUTH_ALLOWED_REDIRECT_URLS 配置 ([31d850f](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/31d850f))
* 新增 redirectUri 参数 ([7180448](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/7180448))
* 新增 删除消息接口；增加消息查询条件 ([d98d17b](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/d98d17b))
* 新增 消息事件存储逻辑；增加 消息查询；修改部分实体类和类型声明 ([287f06a](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/287f06a))
* 新增 用户、验证码实体类；增加验证码路由，初步实现上行登录逻辑 ([b2ac434](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/b2ac434))
* 新增用户管理路由；验证码增加场景字段 ([d214ef2](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/d214ef2))
* 添加 欢迎页面 ([8704ec9](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/8704ec9))
* 重构 OAuth 登录为标准 OAuth2.0 流程 ([ee1e0a3](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/ee1e0a3)), closes [#4](https://github.com/CaoMeiYouRen/wechat-official-helper/issues/4)
* 重构登录逻辑；优化权限验证逻辑；修复验证码可以多次使用的 bug ([9f0ba96](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/9f0ba96))


### 🐛 Bug 修复

* 修复 AclBase 和 Base 的导入问题；优化部分代码 ([7945000](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/7945000))
* 修复 message 接口出现 `Cannot convert undefined or null to object` 的问题 ([d91c513](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/d91c513))
* 修复 POST 请求带 body 时的解析错误 ([a0253e8](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/a0253e8))
* 修复 vercel 开发环境环境变量读取错误的问题；迁移 vercel 到 typescript ([1b0aee0](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/1b0aee0))
* 修复 数据库时区与本地不同时，时间显示错误的问题；优化登录授权接口 ([f8e21be](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/f8e21be))
* 修复 登录页跳转错误 ([34ec3ef](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/34ec3ef))
* 修复 部分情况下找不到 snakeCase 函数的问题 ([fedae57](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/fedae57))
* 移除 不必要的日志输出 ([2bc7689](https://github.com/CaoMeiYouRen/wechat-official-helper/commit/2bc7689))
