import { useEffect, useState } from "react"

interface LoadingSpinnerProps {
  size?: number
}

export default function LoadingSpinner({ size = 10 }: LoadingSpinnerProps) {
  const [frame, setFrame] = useState(0)
  const characters = " .:-+*=%#"
  
  // Create a circular ASCII pattern
  const generateCircle = (currentFrame: number) => {
    const radius = Math.floor(size / 2)
    const result: string[] = []
    
    for (let y = 0; y < size; y++) {
      let row = ""
      for (let x = 0; x < size; x++) {
        // Calculate distance from center
        const dx = x - radius
        const dy = y - radius
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Create circular shape
        if (distance > radius - 0.5 && distance < radius + 0.5) {
          // Calculate angle and add rotation based on current frame
          const angle = Math.atan2(dy, dx) + currentFrame * 0.1
          // Map angle to character index
          const charIndex = Math.floor(((angle % (2 * Math.PI)) / (2 * Math.PI)) * characters.length)
          row += characters[charIndex]
        } else {
          row += " "
        }
      }
      result.push(row)
    }
    
    return result.join("\n")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % 60) // 60 animation frames for full rotation
    }, 50)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center h-full w-full">
      <pre className="font-fancy whitespace-pre leading-none text-black bg-white">
        {generateCircle(frame)}
      </pre>
    </div>
  )
}