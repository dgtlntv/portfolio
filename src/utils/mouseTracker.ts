/**
 * Represents a 2D mouse position in normalized coordinates.
 * @property {number} x - Horizontal position, range [-1, 1] where -1 is left edge and 1 is right edge
 * @property {number} y - Vertical position, range [-1, 1] where -1 is bottom edge and 1 is top edge
 */
export interface Mouse2D {
    x: number
    y: number
}

/**
 * Tracks mouse position in normalized 2D coordinates with throttling and subscription support.
 * Automatically manages event listeners based on active subscriptions.
 *
 * @example
 * ```typescript
 * const tracker = new MouseTracker(16);
 * const unsubscribe = tracker.subscribe((position) => {
 *   console.log(`Mouse at: ${position.x}, ${position.y}`);
 * });
 * unsubscribe(); // Stop tracking
 * ```
 */
export class MouseTracker {
    private position: Mouse2D = { x: 0, y: 0 }
    private listeners: Set<(position: Mouse2D) => void> = new Set()
    private isListening = false
    private throttleTimeout: number | null = null
    private readonly throttleMs: number

    /**
     * Creates a new MouseTracker instance.
     *
     * @param {number} throttleMs - Minimum time in milliseconds between position updates. Default is 16ms (~60fps)
     */
    constructor(throttleMs: number = 16) {
        this.throttleMs = throttleMs
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }

    /**
     * Handles mouse move events with throttling.
     * Converts screen coordinates to normalized [-1, 1] range.
     *
     * @private
     * @param {MouseEvent} event - The native mouse move event
     */
    private handleMouseMove = (event: MouseEvent): void => {
        if (this.throttleTimeout !== null) {
            return
        }

        this.throttleTimeout = window.setTimeout(() => {
            this.throttleTimeout = null
        }, this.throttleMs)

        const newPosition: Mouse2D = {
            x: -1 + (event.clientX / window.innerWidth) * 2,
            y: 1 - (event.clientY / window.innerHeight) * 2,
        }

        this.position = newPosition
        this.notifyListeners(newPosition)
    }

    /**
     * Notifies all subscribed listeners with the current position.
     * Each listener receives a copy of the position to ensure immutability.
     * Errors in individual listeners are caught and logged without affecting other listeners.
     *
     * @private
     * @param {Mouse2D} position - The position to send to all listeners
     */
    private notifyListeners(position: Mouse2D): void {
        this.listeners.forEach((listener) => {
            try {
                listener({ ...position })
            } catch (error) {
                console.error("Error in MouseTracker listener:", error)
            }
        })
    }

    /**
     * Subscribes to mouse position updates.
     * The callback is immediately invoked with the current position.
     * Automatically starts listening to mouse events if not already listening.
     *
     * @param {function(Mouse2D): void} callback - Function to call on position updates
     * @returns {function(): void} Unsubscribe function to stop receiving updates
     * @throws {TypeError} If callback is not a function
     *
     * @example
     * ```typescript
     * const unsubscribe = mouseTracker.subscribe((pos) => {
     *   console.log(`x: ${pos.x}, y: ${pos.y}`);
     * });
     * unsubscribe();
     * ```
     */
    subscribe(callback: (position: Mouse2D) => void): () => void {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function")
        }

        this.listeners.add(callback)

        try {
            callback({ ...this.position })
        } catch (error) {
            console.error(
                "Error in MouseTracker listener on initial call:",
                error,
            )
        }

        if (!this.isListening) {
            this.startListening()
        }

        return () => {
            this.listeners.delete(callback)
            if (this.listeners.size === 0) {
                this.stopListening()
            }
        }
    }

    /**
     * Starts listening to window mouse move events.
     * Only starts if not already listening.
     *
     * @private
     */
    private startListening(): void {
        if (this.isListening) return

        this.isListening = true
        window.addEventListener("mousemove", this.handleMouseMove)
    }

    /**
     * Stops listening to window mouse move events and cleans up resources.
     * Only stops if currently listening.
     *
     * @private
     */
    private stopListening(): void {
        if (!this.isListening) return

        this.isListening = false
        window.removeEventListener("mousemove", this.handleMouseMove)

        // Clean up throttle timeout
        if (this.throttleTimeout !== null) {
            window.clearTimeout(this.throttleTimeout)
            this.throttleTimeout = null
        }
    }

    /**
     * Gets the current mouse position.
     * Returns a copy to maintain immutability.
     *
     * @returns {Mouse2D} A copy of the current mouse position in normalized coordinates
     */
    getCurrentPosition(): Mouse2D {
        return { ...this.position }
    }

    /**
     * Destroys the tracker by removing all listeners and cleaning up resources.
     * Should be called when the tracker is no longer needed to prevent memory leaks.
     */
    destroy(): void {
        this.stopListening()
        this.listeners.clear()
    }
}

export const mouseTracker = new MouseTracker()
