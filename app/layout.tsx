import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from './providers'
export const metadata: Metadata = { title: { default: 'Aparo | Gestão para barbearias', template: '%s | Aparo' }, description: 'Agendamento e gestão para barbearias modernas.', generator: 'Aparo' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#18181b', userScalable: false }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body className="antialiased"><Providers>{children}</Providers>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
