import { formatDateForDisplay, parseDisplayDate } from '@utils'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePortal } from '@/hooks/usePortal'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const getCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1)
  let startDay = firstDay.getDay()
  startDay = startDay === 0 ? 6 : startDay - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const days: Array<{ day: number; month: number; year: number; currentMonth: boolean }> = []

  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
      currentMonth: false,
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, month, year, currentMonth: true })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      month: month === 11 ? 0 : month + 1,
      year: month === 11 ? year + 1 : year,
      currentMonth: false,
    })
  }

  return days
}

export const DatePicker = ({
  value,
  onChange,
  label,
  placeholder = 'dd/mm/yyyy',
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom')
  const [viewDate, setViewDate] = useState(() => new Date(`${value}T00:00:00`))
  const [inputValue, setInputValue] = useState(() => formatDateForDisplay(value))
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days')
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const portalNode = usePortal()
  const inputId = useId()

  useEffect(() => {
    setInputValue(formatDateForDisplay(value))
    setViewDate(new Date(`${value}T00:00:00`))
  }, [value])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current?.contains(target) || dropdownRef.current?.contains(target)) {
        return
      }
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  useEffect(() => {
    if (!open || !containerRef.current || !dropdownRef.current) return

    const positionDropdown = () => {
      if (!containerRef.current || !dropdownRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dropdown = dropdownRef.current
      const dropdownHeight = dropdown.offsetHeight
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top

      let newPlacement: 'bottom' | 'top' = 'bottom'

      if (spaceBelow >= dropdownHeight) {
        dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`
        newPlacement = 'bottom'
      } else if (spaceAbove >= dropdownHeight) {
        dropdown.style.top = `${rect.top + window.scrollY - dropdownHeight - 8}px`
        newPlacement = 'top'
      } else {
        // Default abajo aunque no quepa completamente
        dropdown.style.top = `${rect.bottom + window.scrollY + 4}px`
        newPlacement = 'bottom'
      }

      dropdown.style.left = `${rect.left + window.scrollX}px`
      dropdown.style.width = `${rect.width}px`
      setPlacement(newPlacement)
    }

    // Esperar al siguiente frame para que el DOM tenga la altura real
    const raf = requestAnimationFrame(positionDropdown)

    window.addEventListener('scroll', positionDropdown, true)
    window.addEventListener('resize', positionDropdown)

    // Re-posicionar si la altura del dropdown cambia (ej: cambio de modo)
    const resizeObserver = new ResizeObserver(positionDropdown)
    resizeObserver.observe(dropdownRef.current)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', positionDropdown, true)
      window.removeEventListener('resize', positionDropdown)
      resizeObserver.disconnect()
    }
  }, [open])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      const parsed = parseDisplayDate(e.target.value)
      if (parsed) {
        onChange(parsed)
        setViewDate(new Date(`${parsed}T00:00:00`))
      }
    },
    [onChange]
  )

  const handleInputBlur = useCallback(() => {
    const parsed = parseDisplayDate(inputValue)
    if (parsed) {
      onChange(parsed)
      setInputValue(formatDateForDisplay(parsed))
    } else {
      setInputValue(formatDateForDisplay(value))
    }
  }, [inputValue, onChange, value])

  const handleDayClick = useCallback(
    (day: number, month: number, year: number) => {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      onChange(iso)
      setInputValue(formatDateForDisplay(iso))
      setOpen(false)
      setMode('days')
    },
    [onChange]
  )

  const handleMonthClick = useCallback((monthIndex: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1))
    setMode('days')
  }, [])

  const handleYearClick = useCallback((year: number) => {
    setViewDate((prev) => new Date(year, prev.getMonth(), 1))
    setMode('months')
  }, [])

  const navigateMonth = useCallback((direction: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + direction, 1))
  }, [])

  const navigateYears = useCallback((direction: number) => {
    setViewDate((prev) => new Date(prev.getFullYear() + direction * 12, prev.getMonth(), 1))
  }, [])

  const today = new Date()
  const selectedDate = new Date(`${value}T00:00:00`)

  const renderDays = () => {
    const days = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth())
    return (
      <>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((wd) => (
            <div
              key={wd}
              className="text-center text-xs font-medium text-light-text-muted dark:text-dark-text-muted py-1"
            >
              {wd}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const isToday =
              d.currentMonth &&
              d.day === today.getDate() &&
              d.month === today.getMonth() &&
              d.year === today.getFullYear()
            const isSelected =
              d.currentMonth &&
              d.day === selectedDate.getDate() &&
              d.month === selectedDate.getMonth() &&
              d.year === selectedDate.getFullYear()

            return (
              <button
                key={`${d.year}-${d.month}-${d.day}`}
                type="button"
                disabled={!d.currentMonth}
                onClick={() => handleDayClick(d.day, d.month, d.year)}
                className={`w-full aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${
                  !d.currentMonth
                    ? 'text-light-text-muted/40 dark:text-dark-text-muted/40 cursor-default'
                    : isSelected
                      ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover ring-2 ring-light-accent-primary/30 dark:ring-dark-accent-primary/30'
                      : isToday
                        ? 'bg-light-accent-primary/10 dark:bg-dark-accent-primary/20 border border-light-accent-primary dark:border-dark-accent-primary text-light-accent-primary dark:text-dark-accent-primary font-semibold hover:bg-light-accent-primary/20 dark:hover:bg-dark-accent-primary/30 cursor-pointer'
                        : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary cursor-pointer'
                }`}
              >
                {d.day}
              </button>
            )
          })}
        </div>
      </>
    )
  }

  const renderMonths = () => {
    return (
      <div className="grid grid-cols-3 gap-2">
        {MONTHS.map((m, i) => {
          const isCurrent = i === today.getMonth() && viewDate.getFullYear() === today.getFullYear()
          const isSelected =
            i === selectedDate.getMonth() && viewDate.getFullYear() === selectedDate.getFullYear()
          return (
            <button
              key={m}
              type="button"
              onClick={() => handleMonthClick(i)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover'
                  : isCurrent
                    ? 'border border-light-accent-primary dark:border-dark-accent-primary text-light-accent-primary dark:text-dark-accent-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                    : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
              }`}
            >
              {m}
            </button>
          )
        })}
      </div>
    )
  }

  const renderYears = () => {
    const currentYear = viewDate.getFullYear()
    const startYear = currentYear - 5
    const years = Array.from({ length: 12 }, (_, i) => startYear + i)

    return (
      <div className="grid grid-cols-3 gap-2">
        {years.map((y) => {
          const isCurrent = y === today.getFullYear()
          const isSelected = y === selectedDate.getFullYear()
          return (
            <button
              key={y}
              type="button"
              onClick={() => handleYearClick(y)}
              className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-light-accent-primary dark:bg-dark-accent-primary text-white hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover'
                  : isCurrent
                    ? 'border border-light-accent-primary dark:border-dark-accent-primary text-light-accent-primary dark:text-dark-accent-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
                    : 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary'
              }`}
            >
              {y}
            </button>
          )
        })}
      </div>
    )
  }

  const dropdownContent = (
    <div
      ref={dropdownRef}
      className={`fixed z-50 rounded-xl border border-light-border dark:border-dark-border bg-light-bg-card dark:bg-dark-bg-card shadow-xl p-3 animate-scale-in ${placement === 'top' ? 'origin-bottom' : 'origin-top'}`}
      style={{ minWidth: '280px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => {
            if (mode === 'days') navigateMonth(-1)
            else if (mode === 'years') navigateYears(-1)
          }}
          className="p-1 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary transition-colors disabled:opacity-30"
          disabled={mode === 'months'}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (mode === 'days') setMode('months')
            else if (mode === 'months') setMode('years')
          }}
          className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors px-2 py-1 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary"
        >
          {mode === 'days' && `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          {mode === 'months' && `${viewDate.getFullYear()}`}
          {mode === 'years' && `${viewDate.getFullYear() - 5} - ${viewDate.getFullYear() + 6}`}
        </button>

        <button
          type="button"
          onClick={() => {
            if (mode === 'days') navigateMonth(1)
            else if (mode === 'years') navigateYears(1)
          }}
          className="p-1 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary transition-colors disabled:opacity-30"
          disabled={mode === 'months'}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="min-h-[240px]">
        {mode === 'days' && renderDays()}
        {mode === 'months' && renderMonths()}
        {mode === 'years' && renderYears()}
      </div>
    </div>
  )

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setOpen(true)}
          className="w-full px-3 py-2.5 pr-10 rounded-lg border bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-light-accent-primary/50 dark:focus:ring-dark-accent-primary/50 focus:border-light-accent-primary dark:focus:border-dark-accent-primary transition-colors"
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-light-text-muted dark:text-dark-text-muted hover:text-light-accent-primary dark:hover:text-dark-accent-primary transition-colors"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>
      {open && portalNode && createPortal(dropdownContent, portalNode)}
    </div>
  )
}
