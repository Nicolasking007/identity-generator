import type React from "react"
import { Toaster } from "@/components/toaster"
import './globals.css'

export const metadata: Metadata = {
  title: '身份信息生成器',
  description: '身份信息生成器',
  generator: '身份信息生成器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

