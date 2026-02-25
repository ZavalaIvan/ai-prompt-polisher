'use client'

import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState('claro')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold">AI Prompt Polisher</h1>
        <p className="text-zinc-400 text-sm">
          Pega un prompt flojo y te lo devuelvo mejorado para obtener mejores respuestas de IA.
        </p>

        <textarea
          className="w-full min-h-[140px] p-3 rounded bg-zinc-900 border border-zinc-700"
          placeholder="Escribe tu prompt aquí..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <select
          className="w-full p-2 rounded bg-zinc-900 border border-zinc-700"
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
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? 'Mejorando...' : 'Mejorar prompt'}
        </button>

        {result && (
          <div className="mt-4 p-4 rounded bg-zinc-900 border border-zinc-700">
            <h2 className="font-semibold mb-2">Prompt mejorado:</h2>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>

            <button
              onClick={() => navigator.clipboard.writeText(result)}
              className="mt-2 text-xs text-zinc-300 underline"
            >
              Copiar al portapapeles
            </button>
          </div>
        )}
      </div>
    </main>
  )
}