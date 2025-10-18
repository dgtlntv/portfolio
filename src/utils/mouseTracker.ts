export interface Mouse2D {
  x: number
  y: number
}

export class MouseTracker {
    private position: Mouse2D = { x: 0, y: 0 }
    private listeners: Set<(position: Mouse2D) => void> = new Set()
    private isListening = false

    constructor() {
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    private handleMouseMove = (event: MouseEvent) => {
        this.position.x = -1 + (event.clientX / window.innerWidth) * 2
        this.position.y = 1 - (event.clientY / window.innerHeight) * 2
        
        this.listeners.forEach(listener => listener(this.position))
    }

    subscribe(callback: (position: Mouse2D) => void): () => void {
        this.listeners.add(callback)
        
        if (!this.isListening) {
            this.startListening()
        }

        // Return unsubscribe function
        return () => {
            this.listeners.delete(callback)
            if (this.listeners.size === 0) {
                this.stopListening()
            }
        }
    }

    private startListening() {
        if (this.isListening) return
        
        this.isListening = true
        window.addEventListener('mousemove', this.handleMouseMove)
    }

    private stopListening() {
        if (!this.isListening) return
        
        this.isListening = false
        window.removeEventListener('mousemove', this.handleMouseMove)
    }

    getCurrentPosition(): Mouse2D {
        return { ...this.position }
    }

    destroy() {
        this.stopListening()
        this.listeners.clear()
    }
}

// Global singleton instance
export const mouseTracker = new MouseTracker()