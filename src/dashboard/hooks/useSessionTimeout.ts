import { useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import { useNavigate } from 'react-router-dom'

const TIMEOUT_DURATION = 15 * 60 * 1000
const WARNING_BEFORE = 2 * 60 * 1000

interface UseSessionTimeoutReturn {
  showWarning: boolean
  remainingTime: number
  extendSession: () => void
}

export const useSessionTimeout = (): UseSessionTimeoutReturn => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showWarning, setShowWarning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const warningTimeoutRef = useRef<NodeJS.Timeout>()
  const countdownRef = useRef<NodeJS.Timeout>()
  const lastActivityRef = useRef<number>(Date.now())

  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    setShowWarning(false)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true)
      setRemainingTime(WARNING_BEFORE)

      countdownRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            return 0
          }
          return prev - 1000
        })
      }, 1000)
    }, TIMEOUT_DURATION - WARNING_BEFORE)

    timeoutRef.current = setTimeout(async () => {
      setShowWarning(false)
      await signOut()
      navigate('/login')
    }, TIMEOUT_DURATION)
  }

  const extendSession = () => {
    resetTimer()
  }

  useEffect(() => {
    if (!user) return

    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    const handleActivity = () => {
      resetTimer()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    resetTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [user])

  return {
    showWarning,
    remainingTime,
    extendSession
  }
}
