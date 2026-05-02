import { Moon, Sun, Zap } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'

export const Header = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-light-bg-primary/80 dark:bg-dark-bg-primary/80 border-b border-light-border dark:border-dark-border">
      <div className="max-w-screen-2xl mx-auto px-4 xl:px-8 2xl:px-12 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary flex items-center gap-2">
          <Zap className="w-6 h-6 text-light-accent-primary dark:text-dark-accent-primary" />
          LightMeter
        </div>

        <nav className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => toggleTheme()}
            className="p-2 rounded-lg text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-colors"
            aria-label="Cambiar tema"
            title="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>
    </header>
  )
}
