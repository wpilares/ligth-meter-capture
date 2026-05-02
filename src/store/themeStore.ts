import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

export interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(newTheme)
      },
      setTheme: (theme: Theme) => {
        set({ theme })
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)
      },
    }),
    {
      name: 'theme-storage',
    }
  )
)

export const initializeTheme = () => {
  const stored = localStorage.getItem('theme-storage')
  const theme = stored
    ? (JSON.parse(stored).state.theme as Theme)
    : window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(theme)
}
