"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface ValueCounterProps {
  value: number
}

export function ValueCounter({ value }: ValueCounterProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-green-100 border border-green-300 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm"
    >
      <TrendingUp className="w-4 h-4 text-green-700" />
      <span className="text-green-800 font-semibold">Valor Desbloqueado: $ {value}</span>
    </motion.div>
  )
}
