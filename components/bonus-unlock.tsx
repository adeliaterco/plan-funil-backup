"use client"

import { motion } from "framer-motion"
import { Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect } from "react"

interface BonusUnlockProps {
  bonus: {
    id: number
    title: string
    value: number
    description: string
  }
  onComplete: () => void
}

export function BonusUnlock({ bonus, onComplete }: BonusUnlockProps) {
  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white border-2 border-yellow-400 shadow-2xl">
          <CardContent className="p-8 text-center relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 1],
                  repeat: 0,
                }}
              >
                <Gift className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">🎉 BONOS DESBLOQUEADO!</h2>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <h3 className="text-xl font-semibold text-orange-700 mb-2">{bonus.title}</h3>
              <p className="text-gray-700 mb-4">{bonus.description}</p>
              <div className="text-3xl font-bold text-green-600">Valor: $ {bonus.value}</div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <p className="text-gray-600 text-sm bg-gray-100 p-3 rounded-lg">
                Recibirás esta bonificación junto con el Plan A al final del cuestionario.
              </p>

              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-orange-500 rounded-full"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
