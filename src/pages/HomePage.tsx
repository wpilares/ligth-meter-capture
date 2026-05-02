import { Button } from '@components/ui/Button'
import { Card } from '@components/ui/Card'
import { formatDateForFilename } from '@utils'
import { toPng } from 'html-to-image'
import { Calendar, Camera, Download, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface ReadingData {
  date: string
  readings: Record<string, string>
}

const STORAGE_KEY = 'light-meter-readings'
const DEPARTMENTS = ['201', '202', '301', '302']

const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const loadReadings = (): Record<string, ReadingData> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const saveReadings = (data: Record<string, ReadingData>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export const HomePage = () => {
  const captureRef = useRef<HTMLDivElement>(null)
  const [date, setDate] = useState(getTodayString)
  const [readings, setReadings] = useState<Record<string, string>>(() => {
    const stored = loadReadings()
    const today = getTodayString()
    return stored[today]?.readings || {}
  })
  const [isCapturing, setIsCapturing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load readings when date changes
  useEffect(() => {
    const stored = loadReadings()
    setReadings(stored[date]?.readings || {})
    setErrors({})
  }, [date])

  const handleReadingChange = (dept: string, value: string) => {
    setReadings((prev) => ({ ...prev, [dept]: value }))
    if (errors[dept]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[dept]
        return next
      })
    }
  }

  const handleCapture = useCallback(async () => {
    const newErrors: Record<string, string> = {}
    for (const dept of DEPARTMENTS) {
      if (!readings[dept]?.trim()) {
        newErrors[dept] = 'Ingresa la lectura'
      }
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0 || !captureRef.current) return

    setIsCapturing(true)

    try {
      const isDark = document.documentElement.classList.contains('dark')
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: isDark ? '#111111' : '#f9fafb',
        pixelRatio: 2,
      })

      const link = document.createElement('a')
      link.download = `captura-${formatDateForFilename(date)}.png`
      link.href = dataUrl
      link.click()

      // Save to localStorage
      const stored = loadReadings()
      stored[date] = { date, readings }
      saveReadings(stored)
    } catch {
      // Silently handle capture errors
    } finally {
      setIsCapturing(false)
    }
  }, [date, readings])

  const handleReset = () => {
    setReadings({})
    setErrors({})
    const stored = loadReadings()
    delete stored[date]
    saveReadings(stored)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2">
          Lectura de <span className="gradient-text">Medidores</span>
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary">
          Registra las lecturas y genera una captura.
        </p>
      </div>

      <Card className="animate-slide-up !p-0 overflow-hidden">
        {/* Capturable area - only this gets captured */}
        <div ref={captureRef} className="p-6 md:p-8">
          {/* Date */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border">
              <Calendar className="w-6 h-6 text-light-accent-primary dark:text-dark-accent-primary" />
              <span className="text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                Fecha:{' '}
                {new Date(`${date}T00:00:00`).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Readings - single column */}
          <div className="space-y-6">
            {DEPARTMENTS.map((dept, index) => (
              <div
                key={dept}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <label
                  htmlFor={`dept-${dept}`}
                  className="block text-lg md:text-xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-3"
                >
                  Departamento {dept}
                </label>
                <input
                  id={`dept-${dept}`}
                  type="number"
                  placeholder="Ingresa la lectura"
                  value={readings[dept] || ''}
                  onChange={(e) => handleReadingChange(dept, e.target.value)}
                  min="0"
                  className={`w-full px-4 py-4 text-xl md:text-2xl rounded-xl border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-light-accent-primary/50 dark:focus:ring-dark-accent-primary/50 ${
                    errors[dept]
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-light-border dark:border-dark-border focus:border-light-accent-primary dark:focus:border-dark-accent-primary'
                  }`}
                />
                {errors[dept] && (
                  <span className="mt-2 block text-sm text-red-500">{errors[dept]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Controls - outside capture area */}
        <div className="px-6 pb-6 md:px-8 md:pb-8 border-t border-light-border dark:border-dark-border pt-6">
          {/* Date input */}
          <div className="mb-4">
            <label
              htmlFor="date-input"
              className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2"
            >
              Cambiar fecha
            </label>
            <input
              id="date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-accent-primary/50 dark:focus:ring-dark-accent-primary/50 focus:border-light-accent-primary dark:focus:border-dark-accent-primary transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              size="lg"
              className="flex-1 py-4 text-lg"
              onClick={handleCapture}
              disabled={isCapturing}
            >
              <Camera className="w-6 h-6" />
              {isCapturing ? 'Generando...' : 'Tomar Captura'}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="py-4 text-lg"
              onClick={handleReset}
              disabled={isCapturing}
            >
              <RotateCcw className="w-6 h-6" />
              Limpiar
            </Button>
          </div>

          {/* Download hint */}
          <div className="mt-4 text-center">
            <p className="text-sm text-light-text-muted dark:text-dark-text-muted flex items-center justify-center gap-1">
              <Download className="w-4 h-4" />
              La imagen se descargará automáticamente
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
