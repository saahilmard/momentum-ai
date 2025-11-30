import { useEffect, useRef, memo } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface LatexRendererProps {
  content: string
  className?: string
  display?: boolean
}

export const LatexRenderer = memo(({ content, className = '', display = false }: LatexRendererProps) => {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      // Split content by LaTeX delimiters
      const parts = content.split(/(\$[^$]+\$)/g)
      const renderedParts = parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // This is LaTeX - render it
          const latex = part.slice(1, -1)
          try {
            return katex.renderToString(latex, {
              displayMode: display,
              throwOnError: false,
              strict: false
            })
          } catch (error) {
            console.warn('LaTeX rendering error:', error)
            return part // Return original if rendering fails
          }
        }
        return part // Regular text
      })

      containerRef.current.innerHTML = renderedParts.join('')
    } catch (error) {
      console.error('Error rendering LaTeX:', error)
      containerRef.current.textContent = content
    }
  }, [content, display])

  return <span ref={containerRef} className={className} />
})

interface LatexBlockProps {
  latex: string
  className?: string
}

export const LatexBlock = memo(({ latex, className = '' }: LatexBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    try {
      const rendered = katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: false
      })
      containerRef.current.innerHTML = rendered
    } catch (error) {
      console.error('Error rendering LaTeX block:', error)
      containerRef.current.textContent = latex
    }
  }, [latex])

  return <div ref={containerRef} className={`my-4 overflow-x-auto ${className}`} />
})
