import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'NutraConnect - B2B Supplier Intelligence for Nutraceuticals',
    template: '%s | NutraConnect',
  },
  description:
    'AI-Powered Supplier & Customer Intelligence Platform for the Nutraceutical Industry. Find verified manufacturers, distributors, and retailers across India.',
  keywords: [
    'nutraceuticals',
    'supplements',
    'B2B',
    'suppliers',
    'manufacturers',
    'distributors',
    'India',
    'health products',
    'vitamins',
    'ayurvedic',
  ],
  authors: [{ name: 'NutraConnect' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://nutraconnect.in',
    title: 'NutraConnect - B2B Supplier Intelligence for Nutraceuticals',
    description:
      'AI-Powered Supplier & Customer Intelligence Platform for the Nutraceutical Industry.',
    siteName: 'NutraConnect',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutraConnect - B2B Supplier Intelligence for Nutraceuticals',
    description:
      'AI-Powered Supplier & Customer Intelligence Platform for the Nutraceutical Industry.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col bg-background text-foreground">
              <NavbarWrapper />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
