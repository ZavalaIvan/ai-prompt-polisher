import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { prompt, tone } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt vacío' }, { status: 400 })
    }

    const completion = await client.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un experto en ingeniería de prompts. Tu tarea es mejorar prompts para que sean claros, específicos y produzcan mejores resultados.',
        },
        {
          role: 'user',
          content: `Mejora el siguiente prompt para que sea claro, específico y produzca mejores resultados.
Tono: ${tone}

Prompt original:
${prompt}

Devuelve solo el prompt mejorado.`,
        },
      ],
      temperature: 0.4,
    })

    const result = completion.choices[0].message.content

    return NextResponse.json({ result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al generar el prompt mejorado' },
      { status: 500 }
    )
  }
}