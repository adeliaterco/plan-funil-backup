"use client"

import { motion } from "framer-motion"

interface ThermometerProps {
  level: number
  maxLevel: number
}

export function Thermometer({ level, maxLevel }: ThermometerProps) {
  const percentage = (level / maxLevel) * 100

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="relative">
        <div className="w-8 h-32 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 to-orange-400"
            initial={{ height: "0%" }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 bg-red-500 rounded-full" />
        </div>
      </div>
      <div className="ml-4 text-white">
        <div className="text-2xl font-bold">
          {level}/{maxLevel}
        </div>
        <div className="text-sm text-white/70">Nível de Comprometimento</div>
      </div>
    </div>
  )
}
