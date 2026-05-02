import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'

export const App = () => {
  return (
    <div className="min-h-screen bg-light-bg-primary transition-colors duration-300 dark:bg-dark-bg-primary">
      <Header />
      <main className="pb-12">
        <HomePage />
      </main>
    </div>
  )
}
