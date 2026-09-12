import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

export interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  isActive?: boolean
  variant?: 'ghost' | 'filled'
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, size = 'md', isActive = false, variant = 'ghost', className = '', ...props }, ref) => {
    
    const sizeClasses = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-3',
      xl: 'p-4'
    }

    const variantClasses = {
      ghost: `hover:bg-ink-800/50 ${isActive ? 'text-violet-400' : 'text-paper-100'}`,
      filled: `bg-ink-800 hover:bg-ink-700 ${isActive ? 'text-violet-400 border border-violet-500/50' : 'text-paper-100'}`
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-full flex items-center justify-center transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {icon}
      </motion.button>
    )
  }
)
IconButton.displayName = 'IconButton'
