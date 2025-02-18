import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '身份信息生成器',
  description: '身份信息生成器',
  generator: '身份信息生成器',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
