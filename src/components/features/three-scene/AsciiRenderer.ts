import { LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as THREE from 'three'
import { AsciiEffect } from 'three-stdlib'

@customElement('ascii-renderer')
export class AsciiRenderer extends LitElement {
    static styles = css`
        :host {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        }
    `

    @property({ type: Number })
    resolution = 0.18

    @property({ type: String })
    characters = ' .:-+*=%#'

    private asciiEffect?: AsciiEffect
    private scene?: THREE.Scene
    private camera?: THREE.Camera
    private renderer?: THREE.WebGLRenderer
    private renderCallback?: () => void

    // Method called by parent to set Three.js context
    setThreeContext(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.setupAsciiEffect()
    }

    // Method called by parent to register render callback
    setRenderCallback(callback: () => void) {
        this.renderCallback = callback
    }

    private setupAsciiEffect() {
        if (!this.renderer) return
        
        // Create ASCII effect using the shared renderer
        this.asciiEffect = new AsciiEffect(this.renderer, this.characters, {
            resolution: this.resolution
        })

        // Style the ASCII effect DOM element
        const asciiElement = this.asciiEffect.domElement
        asciiElement.style.position = 'absolute'
        asciiElement.style.top = '0px'
        asciiElement.style.left = '0px'
        asciiElement.style.color = 'black'
        asciiElement.style.backgroundColor = 'white'
        asciiElement.style.pointerEvents = 'none'

        // Append to the same parent as the main canvas
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.appendChild(asciiElement)
        }

        // Set initial size
        this.asciiEffect.setSize(this.clientWidth, this.clientHeight)

        // Setup resize observer
        this.setupResizeObserver()
    }

    private setupResizeObserver() {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                if (width > 0 && height > 0 && this.asciiEffect) {
                    this.asciiEffect.setSize(width, height)
                }
            }
        })
        resizeObserver.observe(this)
    }

    // Method called by parent to render ASCII effect
    renderAscii() {
        if (this.asciiEffect && this.scene && this.camera) {
            this.asciiEffect.render(this.scene, this.camera)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        if (this.asciiEffect) {
            // Remove ASCII effect DOM element
            const asciiElement = this.asciiEffect.domElement
            if (asciiElement.parentNode) {
                asciiElement.parentNode.removeChild(asciiElement)
            }

            // Dispose of the effect (but not the shared renderer)
            if ('dispose' in this.asciiEffect) {
                (this.asciiEffect as any).dispose()
            }
        }
    }

    render() {
        // This component has no visual output - it just manages ASCII rendering
        return null
    }
}