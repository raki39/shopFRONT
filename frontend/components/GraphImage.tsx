'use client'

import { useState, useEffect } from 'react'
import { runsAPI } from '@/lib/api'
import { Loader2, BarChart3, AlertCircle, ZoomIn, X } from 'lucide-react'

interface GraphImageProps {
  graphUrl: string
  darkMode?: boolean
}

export default function GraphImage({ graphUrl, darkMode = false }: GraphImageProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const loadGraph = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = await runsAPI.getGraphBlobUrl(graphUrl)
        setBlobUrl(url)
      } catch (err) {
        console.error('Error loading graph:', err)
        setError('Erro ao carregar gráfico')
      } finally {
        setLoading(false)
      }
    }

    loadGraph()

    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [graphUrl])

  if (loading) {
    return (
      <div className={`mt-3 p-4 rounded-lg border flex items-center justify-center ${
        darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
      }`}>
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
        <span className={`text-sm ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>Carregando gráfico...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`mt-3 p-4 rounded-lg border flex items-center ${
        darkMode ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
      }`}>
        <AlertCircle className={`w-5 h-5 mr-2 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
        <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{error}</span>
      </div>
    )
  }

  return (
    <>
      <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 className={`w-3.5 h-3.5 ${darkMode ? 'text-violet-400' : 'text-indigo-500'}`} />
          <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-700'}`}>Gráfico</span>
        </div>
        <div
          className={`relative rounded-lg border p-2 cursor-pointer group ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={blobUrl!}
            alt="Gráfico gerado"
            className="w-full h-auto rounded"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Modal de zoom */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={blobUrl!}
            alt="Gráfico gerado"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}

