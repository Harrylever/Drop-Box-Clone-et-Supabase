import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Header from "@/components/Header"
import { Toaster } from "react-hot-toast"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import MyQueryClientProvider from "./query-client.provider"

const inter = localFont({
  src: "./fonts/inter.ttf",
  variable: "--font-inter",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Dropbox Clone",
  description: "A Dropbox Clone Project",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <MyQueryClientProvider>
        <html lang="en">
          <body className={`${inter.variable} antialiased`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </MyQueryClientProvider>
    </ClerkProvider>
  )
}
