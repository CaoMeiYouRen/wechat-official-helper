import { FC, PropsWithChildren } from 'hono/jsx'

type Props = PropsWithChildren<{
    title?: string
}>

export const Layout: FC<Props> = (props) => <html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <title>{props.title}</title>
    </head>
    <body>{props.children}</body>
</html>

