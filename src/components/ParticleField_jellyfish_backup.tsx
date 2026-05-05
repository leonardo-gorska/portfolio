"use client"

import { useEffect, useRef } from "react"

/**
 * Jellyfish Cloud — Proper spring-mass system.
 * 
 * Architecture:
 * 1. CENTER follows mouse with spring physics (overshoot when stopping)
 * 2. Each particle has a HOME OFFSET (fixed angle + distance from center)
 * 3. Pulse modifies the home offset distance (jellyfish breathing)
 * 4. Each particle has ITS OWN position that springs toward its home
 * 5. = jelly wobble when center moves
 */

const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#e11d48", "#f97316", "#10b981"]

interface Props { colors?: string[] }

export default function ParticleField({ colors = DEFAULT_COLORS }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let w = window.innerWidth
    let h = window.innerHeight
    let mouseX = w / 2, mouseY = h / 2

    // === CENTER SPRING (follows mouse with overshoot) ===
    let cx = w / 2, cy = h / 2  // center position
    let cvx = 0, cvy = 0         // center velocity

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w * devicePixelRatio
      canvas.height = h * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }
    addEventListener("resize", resize); resize()
    addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY })

    // === PARTICLES ===
    const particles: {
      homeAngle: number
      homeDist: number
      x: number; y: number
      vx: number; vy: number
      k: number
      damp: number
      size: number
      color: string
      alpha: number
      // Organic wave: 3 sine layers with random freq/phase each
      wave1Freq: number; wave1Phase: number; wave1Amp: number
      wave2Freq: number; wave2Phase: number; wave2Amp: number
      wave3Freq: number; wave3Phase: number; wave3Amp: number
      // Slow angle drift
      angleDrift: number
    }[] = []

    const COUNT = 400

    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 15 + Math.random() * 320
      const nd = dist / 340
      const k = 0.055 - nd * 0.035
      const damp = 0.87 - nd * 0.06

      particles.push({
        homeAngle: angle,
        homeDist: dist,
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: 0, vy: 0,
        k, damp,
        size: 0.6 + Math.random() * 2.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.25 + Math.random() * 0.6,
        // 3 radial wave layers — unique random freq/phase per particle
        wave1Freq: 0.3 + Math.random() * 0.8,
        wave1Phase: Math.random() * Math.PI * 2,
        wave1Amp: 20 + nd * 50,
        wave2Freq: 0.7 + Math.random() * 1.5,
        wave2Phase: Math.random() * Math.PI * 2,
        wave2Amp: 10 + nd * 30,
        wave3Freq: 1.2 + Math.random() * 2.5,
        wave3Phase: Math.random() * Math.PI * 2,
        wave3Amp: 5 + nd * 15,
        // Angular drift + oscillation
        angleDrift: (Math.random() - 0.5) * 0.012,
      })
    }

    // Background stars
    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      s: Math.random() * 1.2, a: 0.05 + Math.random() * 0.25,
    }))

    let time = 0
    let raf: number

    const loop = () => {
      time += 0.016

      // 1) CENTER SPRING — follows mouse with overshoot
      const cSpringK = 0.035
      const cDamp = 0.82
      cvx += (mouseX - cx) * cSpringK
      cvy += (mouseY - cy) * cSpringK
      cvx *= cDamp
      cvy *= cDamp
      cx += cvx
      cy += cvy

      // 2) CLEAR
      ctx.clearRect(0, 0, w, h)

      // 3) STARS
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150,150,150,${s.a})`
        ctx.fill()
      }

      // 4) UPDATE + DRAW PARTICLES
      for (const p of particles) {
        const nd = p.homeDist / 340

        // === MAIN COHERENT PULSE (visible wave from center → edge) ===
        // This is the "jellyfish contraction" — all particles share this rhythm
        // Phase offset by distance = wave radiates outward like a ripple
        const mainPulse = Math.sin(time * 1.2 - nd * 3.5) * (30 + nd * 50)
        // Second harmonic for asymmetry (fast contract, slow expand)
        const secondPulse = Math.sin(time * 2.4 - nd * 4.0) * (8 + nd * 15)

        // === SMALL per-particle organic texture (subtle, not dominant) ===
        const texture = Math.sin(time * p.wave1Freq + p.wave1Phase) * p.wave1Amp * 0.15
                      + Math.sin(time * p.wave2Freq + p.wave2Phase) * p.wave2Amp * 0.1

        const currentDist = p.homeDist + mainPulse + secondPulse + texture

        // Angular wave tied to main pulse (tentacles sway with contraction)
        const angularSway = Math.sin(time * 1.2 - nd * 2.0 + p.wave1Phase) * 0.06 * nd

        // Drift + coherent angular sway
        p.homeAngle += p.angleDrift + angularSway * 0.015

        // Home position = center + offset
        const homeX = cx + Math.cos(p.homeAngle) * currentDist
        const homeY = cy + Math.sin(p.homeAngle) * currentDist

        // Spring: particle → home
        p.vx += (homeX - p.x) * p.k
        p.vy += (homeY - p.y) * p.k
        p.vx *= p.damp
        p.vy *= p.damp
        p.x += p.vx
        p.y += p.vy

        // Draw
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        const dynSize = p.size + Math.min(speed * 0.08, 1.5)

        ctx.beginPath()
        ctx.arc(p.x, p.y, dynSize, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()

        // Soft glow when moving fast
        if (speed > 1.5) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, dynSize * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.globalAlpha = Math.min(speed * 0.01, 0.1)
          ctx.fill()
        }

        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      removeEventListener("resize", resize)
      cancelAnimationFrame(raf)
    }
  }, [colors])

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: 0,
    }} />
  )
}
