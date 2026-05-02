import { useThemeStore } from '@store'

export const useTheme = () => {
  const { theme, toggleTheme, setTheme } = useThemeStore()
  return { theme, toggleTheme, setTheme }
}
