import { useEffect, useRef } from "react"

/**
 * @summary gets callback and return a callback which make sure on specific amount of time will be called just once
 * @param callback
 * @param configj
 * 
 * @return throttled callback
 */
export default function useThrottle<A extends unknown[], R>
(callback: (...args: A) => R, configs?: { throttleTime: number}): (...args: A) => R | undefined{
  if (configs?.throttleTime && configs.throttleTime <= 0) {
    throw new Error("Throttle Time shouldn't be less than or equal to zero")
  }

  const DEFAULT_THROTTLE_TIME = 500
  const finalThrottleTime = configs?.throttleTime || DEFAULT_THROTTLE_TIME

  const lastCalledAt = useRef<ReturnType<typeof Date.now>| null>(null)
  const currentSetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function useCleartimoutOnUnmount() {
    useEffect(() => () => {
      if (!currentSetTimeout.current) return
      clearTimeout(currentSetTimeout.current)
    }, [])
  }

  useCleartimoutOnUnmount()
 
  return (...args: A): R | undefined => {
    if (lastCalledAt.current && Date.now() - lastCalledAt.current <= finalThrottleTime) {
      return
    }

     const result = callback(...args)
    lastCalledAt.current = Date.now()

    currentSetTimeout.current = setTimeout(() => {
      lastCalledAt.current = null
    }, finalThrottleTime)

    return result 
  }
}