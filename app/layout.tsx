import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'HireFast',
  description: 'Performance optimized job portal'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <QueryProvider>
          <Navbar />
          <main style={{ maxWidth: '1400px', margin: '0 auto', paddingInline: '1rem', paddingBlock: '2rem' }}>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
