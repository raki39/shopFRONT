'use client'

import { useState, useEffect } from 'react'
import { runsAPI } from '@/lib/api'
import { Loader2, BarChart3, AlertCircle, ZoomIn, X } from 'lucide-react'

interface GraphImageProps {
  graphUrl: string
}

export default function GraphImage({ graphUrl }: GraphImageProps) {
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
      <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-indigo-500 mr-2" />
        <span className="text-sm text-gray-500">Carregando gráfico...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200 flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
        <span className="text-sm text-red-600">{error}</span>
      </div>
    )
  }

  return (
    <>
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center gap-1.5 mb-2">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
          <span className="text-xs font-semibold text-gray-700">Gráfico</span>
        </div>
        <div 
          className="relative bg-white rounded-lg border border-gray-200 p-2 cursor-pointer group"
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

