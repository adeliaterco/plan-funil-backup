"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface EmailCaptureProps {
  onSubmit: (email: string) => void
  onClose: () => void
}

export function EmailCapture({ onSubmit, onClose }: EmailCaptureProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      onSubmit(email)
    }
  }

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
          <CardContent className="p-8 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Último Passo!</h3>
              <p className="text-white/80">Digite seu melhor email para receber o acesso imediato</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                required
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3"
              >
                Finalizar Compra
              </Button>
            </form>

            <p className="text-white/60 text-xs text-center mt-4">Seus dados estão seguros e protegidos</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
