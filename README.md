<h1 align="center">wechat-official-helper </h1>
<p>
  <img alt="Version" src="https://img.shields.io/github/package-json/v/CaoMeiYouRen/wechat-official-helper.svg" />
  <a href="https://hub.docker.com/r/caomeiyouren/wechat-official-helper" target="_blank">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/caomeiyouren/wechat-official-helper">
  </a>
  <a href="https://github.com/CaoMeiYouRen/wechat-official-helper/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/wechat-official-helper/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D16-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/wechat-official-helper#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/wechat-official-helper/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/wechat-official-helper/blob/master/LICENSE" target="_blank">
    <img alt="License: AGPL-3.0" src="https://img.shields.io/github/license/CaoMeiYouRen/wechat-official-helper?color=yellow" />
  </a>
</p>


> 一个基于 Hono 实现的云函数版本的微信公众号助手，支持个人非认证公众号的上行登录、用户消息存储等功能，支持 OAuth2.0 登录。

## 🏠 主页

[https://github.com/CaoMeiYouRen/wechat-official-helper#readme](https://github.com/CaoMeiYouRen/wechat-official-helper#readme)


## 📦 依赖要求


- node >=20

## 🚀 部署

### Vercel 部署（推荐）

点击以下按钮一键部署到 Vercel。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCaoMeiYouRen%2Fwechat-official-helper.git)

### Docker 镜像

支持两种注册表：

- Docker Hub: [`caomeiyouren/wechat-official-helper`](https://hub.docker.com/r/caomeiyouren/wechat-official-helper)
- GitHub: [`ghcr.io/caomeiyouren/wechat-official-helper`](https://github.com/CaoMeiYouRen/wechat-official-helper/pkgs/container/wechat-official-helper)

支持以下架构：

- `linux/amd64`
- `linux/arm64`

有以下几种 tags：

| Tag            | 描述     | 举例          |
| :------------- | :------- | :------------ |
| `latest`       | 最新     | `latest`      |
| `{YYYY-MM-DD}` | 特定日期 | `2024-06-07`  |
| `{sha-hash}`   | 特定提交 | `sha-0891338` |
| `{version}`    | 特定版本 | `1.2.3`       |

### Docker Compose 部署

下载 [docker-compose.yml](https://github.com/CaoMeiYouRen/wechat-official-helper/blob/master/docker-compose.yml)

```sh
wget https://raw.githubusercontent.com/CaoMeiYouRen/wechat-official-helper/refs/heads/master/docker-compose.yml
```

检查有无需要修改的配置

```sh
vim docker-compose.yml  # 也可以是你喜欢的编辑器
```

> 在公网部署时请务必修改 WX_TOKEN、DATABASE_URL、ADMIN_KEY、JWT_SECRET、CLIENT_SECRET 等环境变量。
>
> 具体请查看 `.env` 文件。

启动

```sh
docker-compose up -d
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

### Node.js 部署

确保本地已安装 Node.js 和 pnpm。

```sh
# 下载源码
git clone https://github.com/CaoMeiYouRen/wechat-official-helper.git  --depth=1
cd wechat-official-helper
# 安装依赖
pnpm i --frozen-lockfile
# 构建项目
pnpm build
# 启动项目
pnpm start
```

在浏览器中打开 `http://{Server IP}:3000` 即可查看结果

## 👨‍💻 使用

如果在本地部署，基础路径为 `http://localhost:3000`

在服务器或云函数部署则为  `http(s)://{Server IP}`。

例如：

如果基础路径为 `https://example.vercel.app`，则 `/event` 的完整路径为 `https://example.vercel.app/event`

### 响应微信公众号消息

> 待完善

### OAuth2.0 登录

> 待完善

## 🛠️ 开发

```sh
npm run dev
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```

## 💾 Commit

```sh
npm run commit
```


## 👤 作者


**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)

* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/wechat-official-helper/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/wechat-official-helper/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

<a href="https://afdian.com/@CaoMeiYouRen">
  <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306192324870.png" width="312px" height="78px" alt="在爱发电支持我">
</a>

<a href="https://patreon.com/CaoMeiYouRen">
    <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306142054108.svg" width="312px" height="78px" alt="become a patreon"/>
</a>

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/wechat-official-helper&type=Date)](https://star-history.com/#CaoMeiYouRen/wechat-official-helper&Date)

## 📝 License

Copyright © 2024 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [AGPL-3.0](https://github.com/CaoMeiYouRen/wechat-official-helper/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
