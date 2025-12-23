'use client'

import { useRouter } from 'next/navigation'
import { Construction, ArrowLeft } from 'lucide-react'

export default function EmConstrucaoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center p-8">
        <div className="mb-8">
          <Construction className="w-24 h-24 mx-auto text-yellow-500 animate-pulse" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Em Construção
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Esta página está sendo desenvolvida e estará disponível em breve.
        </p>
        
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>
    </div>
  )
}

