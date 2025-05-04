import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flowise",
  description: "LLM Workflow Automation",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
