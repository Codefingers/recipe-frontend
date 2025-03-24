import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Plukos Recipes",
  description: "Your personal recipe collection",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 max-w-5xl mx-auto px-4">
                  <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Plukos Recipes. All rights reserved.
                  </p>
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'