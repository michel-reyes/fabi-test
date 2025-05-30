import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Uber Eats Clone API',
  description: 'Next.js API backend for Uber Eats Clone application',
};

/**
 * Root layout component for the application
 * 
 * @param props Component props including children elements
 * @returns Root layout component
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">{children}</body>
    </html>
  );
}
