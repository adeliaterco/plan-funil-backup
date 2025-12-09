"use client"

import { motion } from "framer-motion"
import { Loader2, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface LoadingAnalysisProps {
  message: string
  successMessage?: string
}

export function LoadingAnalysis({ message, successMessage }: LoadingAnalysisProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setShowSuccess(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            {!showSuccess ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="mb-6"
                >
                  <Loader2 className="w-12 h-12 text-blue-400 mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">Analisando...</h3>
                <p className="text-white/80">{message}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                </motion.div>
                <h3 className="text-xl font-bold text-green-400 mb-2">Análise Completa!</h3>
                <p className="text-white/80">{successMessage}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
