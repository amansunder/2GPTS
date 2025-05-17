import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: '2GPTS Platform',
  description: 'Custom GPT SaaS platform built with Next.js, Tailwind, and Prisma',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        {children}
      </body>
    </html>
  );
}
