import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cabinet, dimensions, material } = body

    // Generate a prompt for the render
    const prompt = `A professional 3D render of a furniture cabinet. 
    Dimensions: ${dimensions.width}mm x ${dimensions.height}mm x ${dimensions.depth}mm.
    Material: ${material.type}, ${material.thickness}mm thick.
    Style: modern, clean, isometric view, white background, professional product photography.
    Show the cabinet from a 45-degree angle with good lighting.`

    // Use DALL-E to generate an image
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
    })

    return NextResponse.json({
      success: true,
      imageUrl: response.data[0].url,
    })
  } catch (error) {
    console.error('Render generation error:', error)
    // Fallback: return a placeholder
    return NextResponse.json({
      success: false,
      error: 'Failed to generate render',
      imageUrl: null,
    })
  }
}
