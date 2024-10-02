import { FC, JSX, PropsWithChildren } from 'hono/jsx'

type Props = PropsWithChildren<{
    title?: string
}>

export const Layout: FC<Props> = (props) => {
    return (
        <html>
            <head>
                <title>{props.title}</title>
            </head>
            <body>{props.children}</body>
        </html>
    )
}
