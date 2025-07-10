import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
// Import ForcePasswordChange
import { ForcePasswordChange } from "@/components/force-password-change"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistem RT/RW - Pendataan UMKM",
  description: "Sistem pendataan UMKM untuk RT/RW",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Add ForcePasswordChange component dalam AuthProvider */}
        <AuthProvider>
          <ForcePasswordChange />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
