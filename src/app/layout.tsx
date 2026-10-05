import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'BPO Prep AI – Concentrix US Non-Voice Interview Preparation',
  description: 'AI-powered practice platform for Concentrix US BPO non-voice (email and chat support) recruitment assessments. English grammar, reading comprehension, typing speed, email evaluation, chat simulation, and full mock tests.',
  keywords: [
    'Concentrix BPO Interview',
    'Non-voice assessment test',
    'Email writing test practice',
    'BPO typing test',
    'Customer chat simulation',
    'Concentrix Bengaluru US process',
    'Aptitude test BPO'
  ],
  authors: [{ name: 'BPO Prep AI' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
