import { useEffect, useRef } from 'react'

/**
 * Organic Blob Field — "Jellyfish / Antigravity" style.
 * 
 * Key differences from a dot grid:
 * - Mouse position is LERPED (lazy follow) for organic, slow movement
 * - Uses simplex-like noise for organic shape deformation
 * - Multiple layered blobs with different speeds create depth
 * - Soft gradient fills instead of hard dots
 * - Ambient drift animation — always moving, even without mouse
 */

// Simple 2D noise (value noise with smooth interpolation)
function hash(x: number, y: number): number {
  let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  // Smooth interpolation
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)

  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)

  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function noise2D(x: number, y: number): number {
  // Fractal brownian motion — 3 octaves
  let val = 0
  val += smoothNoise(x, y) * 0.5
  val += smoothNoise(x * 2, y * 2) * 0.25
  val += smoothNoise(x * 4, y * 4) * 0.125
  return val
}

interface Blob {
  x: number
  y: number
  baseRadius: number
  color: string
  speed: number
  noiseOffsetX: number
  noiseOffsetY: number
  opacity: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const animationId = useRef<number>(0)
  const time = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        window.innerHeight
      )
    }
    resize()
    window.addEventListener('resize', resize)

    // Center initial position
    smoothMouse.current = { x: canvas.width / 2, y: canvas.height / 2 }
    mouse.current = { ...smoothMouse.current }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY + window.scrollY,
      }
      initialized.current = true
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Define organic blobs — layered for depth
    const blobs: Blob[] = [
      { x: 0, y: 0, baseRadius: 280, color: '99, 102, 241', speed: 0.3, noiseOffsetX: 0, noiseOffsetY: 100, opacity: 0.06 },
      { x: 0, y: 0, baseRadius: 200, color: '139, 92, 246', speed: 0.5, noiseOffsetX: 50, noiseOffsetY: 200, opacity: 0.08 },
      { x: 0, y: 0, baseRadius: 140, color: '59, 130, 246', speed: 0.7, noiseOffsetX: 100, noiseOffsetY: 300, opacity: 0.1 },
      { x: 0, y: 0, baseRadius: 90, color: '168, 85, 247', speed: 0.85, noiseOffsetX: 150, noiseOffsetY: 400, opacity: 0.12 },
      { x: 0, y: 0, baseRadius: 50, color: '192, 132, 252', speed: 0.95, noiseOffsetX: 200, noiseOffsetY: 500, opacity: 0.15 },
    ]

    const animate = () => {
      time.current += 0.004 // Very slow time progression

      // LERP mouse position — this is what makes it "organic" and slow
      const lerpFactor = 0.03 // Lower = more laggy/organic
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * lerpFactor
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * lerpFactor

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const t = time.current
      const mx = smoothMouse.current.x
      const my = smoothMouse.current.y

      // Draw each blob layer
      for (const blob of blobs) {
        // Each blob follows the lerped mouse with different lag
        const blobLerp = blob.speed * 0.04
        blob.x += (mx - blob.x) * blobLerp
        blob.y += (my - blob.y) * blobLerp

        // Draw organic blob using noise-deformed circle
        const segments = 80
        ctx.beginPath()

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2
          
          // Noise-based radius deformation for organic shape
          const nx = Math.cos(angle) * 2 + blob.noiseOffsetX + t * 0.8
          const ny = Math.sin(angle) * 2 + blob.noiseOffsetY + t * 0.6
          const noiseVal = noise2D(nx, ny)
          
          // Additional slow undulation
          const undulation = Math.sin(angle * 3 + t * 2) * 0.08 +
                            Math.sin(angle * 5 - t * 1.5) * 0.05 +
                            Math.cos(angle * 2 + t * 3) * 0.06
          
          const radiusDeform = 1 + (noiseVal - 0.5) * 0.5 + undulation
          const r = blob.baseRadius * radiusDeform

          const px = blob.x + Math.cos(angle) * r
          const py = blob.y + Math.sin(angle) * r

          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }

        ctx.closePath()

        // Radial gradient fill for soft glow
        const gradient = ctx.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, blob.baseRadius * 1.3
        )
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.opacity * 1.5})`)
        gradient.addColorStop(0.5, `rgba(${blob.color}, ${blob.opacity})`)
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`)

        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    const handleScroll = () => {
      const newH = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      if (Math.abs(canvas.height - newH) > 100) {
        canvas.height = newH
      }
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animationId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
