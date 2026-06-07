import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'OMEDEV-AI | Agent IA Professionnel',
    template: '%s | OMEDEV-AI',
  },
  description:
    'OMEDEV-AI — Système Autonome de Génération de Code, Interaction Système et Intelligence Artificielle Avancée. Développé par OMEDEV SERVICES SARL, Kinshasa, RDC.',
  keywords: [
    'IA',
    'Intelligence Artificielle',
    'Claude',
    'OMEDEV',
    'Kinshasa',
    'RDC',
    'Agent IA',
    'Génération de code',
    'OHADA',
  ],
  authors: [{ name: 'OMEDEV SERVICES SARL', url: 'https://omedev.cd' }],
  creator: 'OMEDEV SERVICES SARL',
  publisher: 'OMEDEV SERVICES SARL',
  metadataBase: new URL('https://ai.omedev.cd'),
  openGraph: {
    title: 'OMEDEV-AI | Agent IA Professionnel',
    description: 'Agent IA professionnel développé par OMEDEV SERVICES SARL, Kinshasa, RDC',
    type: 'website',
    locale: 'fr_CD',
    siteName: 'OMEDEV-AI',
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0D1117' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
