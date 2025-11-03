import type { PropertyValues } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import type { Camera, Scene, WebGLRenderer } from "three"
import { AsciiEffect } from "./AsciiEffect"

type ConfigurableAsciiEffect = AsciiEffect & {
    dispose: () => void
    setCharSet: (characters: string) => void
    setResolution: (resolution: number) => void
}

@customElement("ascii-renderer")
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
    characters = " .:-+*=%#"

    private asciiEffect: ConfigurableAsciiEffect | null = null
    private scene: Scene | null = null
    private camera: Camera | null = null
    private renderer: WebGLRenderer | null = null
    private resizeObserver: ResizeObserver | null = null

    // Method called by parent to set Three.js context
    setThreeContext(scene: Scene, camera: Camera, renderer: WebGLRenderer) {
        this.scene = scene
        this.camera = camera
        this.renderer = renderer
        this.setupAsciiEffect()
    }

    private setupAsciiEffect() {
        if (!this.renderer || !this.scene || !this.camera) {
            return
        }

        this.teardownAsciiEffect()

        const asciiEffect = new AsciiEffect(this.renderer, this.characters, {
            resolution: this.resolution,
        }) as ConfigurableAsciiEffect

        this.asciiEffect = asciiEffect

        const asciiElement = asciiEffect.domElement
        asciiElement.style.position = "absolute"
        asciiElement.style.top = "0"
        asciiElement.style.left = "0"
        asciiElement.style.color = "black"
        asciiElement.style.backgroundColor = "white"
        asciiElement.style.pointerEvents = "none"

        const parent = this.renderer.domElement.parentNode as
            | HTMLElement
            | ShadowRoot
            | null
        parent?.appendChild(asciiElement)

        const rect = this.getBoundingClientRect()
        const width = rect.width || this.clientWidth || 1
        const height = rect.height || this.clientHeight || 1

        asciiEffect.setSize(width, height)
        this.setupResizeObserver()
    }

    private setupResizeObserver() {
        this.disposeResizeObserver()

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                if (
                    width > 0 &&
                    height > 0 &&
                    this.asciiEffect &&
                    this.renderer
                ) {
                    this.asciiEffect.setSize(width, height)
                }
            }
        })
        this.resizeObserver.observe(this as Element)
    }

    private disposeResizeObserver() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }
    }

    private teardownAsciiEffect() {
        this.disposeResizeObserver()

        if (!this.asciiEffect) {
            return
        }

        const asciiElement = this.asciiEffect.domElement
        asciiElement.parentNode?.removeChild(asciiElement)
        this.asciiEffect.dispose()
        this.asciiEffect = null
    }

    // Method called by parent to render ASCII effect
    renderAscii() {
        if (this.asciiEffect && this.scene && this.camera) {
            this.asciiEffect.render(this.scene, this.camera)
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.teardownAsciiEffect()
        this.scene = null
        this.camera = null
        this.renderer = null
    }

    protected updated(changed: PropertyValues<this>): void {
        if (changed.has("characters") && this.asciiEffect) {
            this.asciiEffect.setCharSet(this.characters)
        }

        if (changed.has("resolution") && this.asciiEffect) {
            this.asciiEffect.setResolution(this.resolution)
        }
    }

    render() {
        // This component has no visual output - it just manages ASCII rendering
        return html``
    }
}
