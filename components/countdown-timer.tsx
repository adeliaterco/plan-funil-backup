"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  initialHours?: number
  initialMinutes?: number
  initialSeconds?: number
}

export function CountdownTimer({ 
  initialHours = 0, 
  initialMinutes = 47, 
  initialSeconds = 0 
}: CountdownTimerProps = {}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center gap-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-red-600 rounded-lg p-4 min-w-[80px]"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="text-3xl font-bold text-white">{value.toString().padStart(2, "0")}</div>
          <div className="text-red-200 text-sm uppercase">
            {unit === "hours" ? "Horas" : unit === "minutes" ? "Min" : "Seg"}
          </div>
        </motion.div>
      ))}
    </div>
  )
}