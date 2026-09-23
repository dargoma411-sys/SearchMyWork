import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'SearchMyWork - Вакансии и предложения о работе',
  description: 'Платформа для поиска работы и размещения вакансий',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
