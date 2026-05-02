import { useEffect, useRef } from 'react'

export const usePortal = () => {
  const portalNodeRef = useRef<HTMLDivElement | null>(null)

  if (!portalNodeRef.current) {
    portalNodeRef.current = document.createElement('div')
    portalNodeRef.current.setAttribute('data-portal', 'true')
  }

  useEffect(() => {
    const node = portalNodeRef.current
    if (!node) return
    document.body.appendChild(node)
    return () => {
      document.body.removeChild(node)
    }
  }, [])

  return portalNodeRef.current
}
