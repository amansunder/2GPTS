import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: '2GPTS Platform',
  description: 'Custom GPTs for community & institutions',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-sans">{children}</body>
    </html>
  )
}
