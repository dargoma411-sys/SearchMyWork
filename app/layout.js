import './globals.css'
import { AppProvider } from '@/lib/context'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'SearchMyWork — Вакансии и соискатели',
  description: 'Платформа для поиска работы и размещения вакансий',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <AppProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  )
}
