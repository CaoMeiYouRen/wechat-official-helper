import { FC, PropsWithChildren } from 'hono/jsx'

export const Layout: FC<PropsWithChildren> = (props) => {
    return (
        <html>
            <head>
                <title>Welcome to Wechat Official Helper</title>
            </head>
            <body>{props.children}</body>
        </html>
    )
}
