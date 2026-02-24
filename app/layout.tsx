import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'TrustShield AI | Confidence & Evidence Layer',
    description: 'AI Output Risk Scoring & Governance Infrastructure for Regulated Industries',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="main-container">
                    {children}
                </div>
            </body>
        </html>
    )
}
