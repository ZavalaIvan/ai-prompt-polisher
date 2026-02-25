'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('claro')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const saveToHistory = (text: string) => {
    const next = [text, ...history].slice(0, 3)
    setHistory(next)
    localStorage.setItem('history', JSON.stringify(next))
  }

  const handleSubmit = async () => {
    if (!prompt) return
    setLoading(true)
    setResult('')

    const res = await fetch('/api/polish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, tone }),
    })

    const data = await res.json()
    setResult(data.result)
    saveToHistory(data.result)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-semibold">AI Prompt Polisher</h1>
          <p className="text-zinc-400 mt-2 text-sm">
            Convierte prompts flojos en instrucciones claras para obtener mejores respuestas de IA.
          </p>
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <textarea
            className="w-full min-h-[120px] p-3 rounded-lg bg-zinc-950 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Ej: Quiero que ChatGPT me ayude a escribir un post para Instagram sobre mi barbería"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* Contador de caracteres */}
          <p className="text-xs text-zinc-500 text-right">
            {prompt.length} caracteres
          </p>

          <div className="flex gap-2">
            <select
              className="flex-1 p-2 rounded-lg bg-zinc-950 border border-zinc-700"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="claro">Claro</option>
              <option value="técnico">Técnico</option>
              <option value="creativo">Creativo</option>
            </select>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {loading ? 'Mejorando...' : 'Mejorar'}
            </button>
          </div>

          {loading && (
            <p className="text-xs text-zinc-400 animate-pulse">
              Analizando tu prompt…
            </p>
          )}

          {/* Estado vacío con micro-copy */}
          {!result && !loading && (
            <p className="text-xs text-zinc-500">
              Consejo: añade contexto + objetivo + formato deseado para mejores resultados.
            </p>
          )}
        </div>

        {result && (
          <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-medium">Prompt mejorado</h2>
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                Copiar
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-zinc-200">
              {result}
            </pre>
            <p className="mt-2 text-xs text-zinc-500">
              Tip: pégalo directo en ChatGPT o tu herramienta de IA.
            </p>
          </div>
        )}

        {/* Historial local */}
        {history.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-zinc-400 mb-1">Últimos prompts generados</p>
            <ul className="space-y-1">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="text-xs text-zinc-500 truncate cursor-pointer hover:text-white hover:underline"
                  onClick={() => setResult(h)}
                  title="Click para volver a ver"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}