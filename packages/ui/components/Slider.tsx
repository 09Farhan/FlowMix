import React, { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export interface SliderProps {
  value: number
  min?: number
  max?: number
  onChange?: (value: number) => void
  onDragStart?: () => void
  onDragEnd?: (value: number) => void
  className?: string
}

export const Slider = ({
  value,
  min = 0,
  max = 100,
  onChange,
  onDragStart,
  onDragEnd,
  className = ''
}: SliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Calculate percentage
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    onDragStart?.()
    updateValueFromEvent(e)
    containerRef.current.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    updateValueFromEvent(e)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return
    setIsDragging(false)
    const newValue = updateValueFromEvent(e)
    onDragEnd?.(newValue)
    containerRef.current.releasePointerCapture(e.pointerId)
  }

  const updateValueFromEvent = (e: React.PointerEvent): number => {
    if (!containerRef.current) return value
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const newPercent = x / rect.width
    const newValue = min + newPercent * (max - min)
    onChange?.(newValue)
    return newValue
  }

  return (
    <div 
      ref={containerRef}
      className={`relative h-6 flex items-center cursor-pointer group touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Track Background */}
      <div className="absolute w-full h-1.5 bg-ink-800 rounded-full overflow-hidden">
        {/* Fill */}
        <motion.div 
          className="absolute h-full bg-violet-500 rounded-full"
          style={{ width: `${percentage}%` }}
          transition={{ type: 'spring', bounce: 0, duration: isDragging ? 0 : 0.3 }}
        />
      </div>

      {/* Handle */}
      <motion.div
        className="absolute w-4 h-4 bg-paper-50 rounded-full shadow-lg border border-ink-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ left: `calc(${percentage}% - 8px)` }}
        animate={{ scale: isDragging ? 1.2 : 1 }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.2 }}
      />
    </div>
  )
}
