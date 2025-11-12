import type { PropertyValues } from "lit"
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import type { Camera, Scene, WebGLRenderer } from "three"
import {
    AsciiEffect,
    type AsciiEffectOptions,
} from "../ascii-effect/AsciiEffect"

@customElement("ascii-renderer")
export class AsciiRenderer extends LitElement {
    static override styles = css`
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

    private asciiEffect: AsciiEffect | null = null
    private scene: Scene | null = null
    private camera: Camera | null = null
    private renderer: WebGLRenderer | null = null
    private originalCanvasOpacity: string | null = null

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

        const canvas = this.renderer.domElement

        const options: AsciiEffectOptions = {
            resolution: this.resolution,
            color: false,
            invert: false,
            objectFit: "fill",
            layout: "static",
        }

        const asciiEffect = new AsciiEffect(canvas, this.characters, options)
        asciiEffect.init()

        const asciiContainer = asciiEffect.getAsciiContainer()
        asciiContainer.style.backgroundColor = "white"
        asciiContainer.style.pointerEvents = "none"
        asciiContainer.style.position = "absolute"
        asciiContainer.style.inset = "0"
        asciiContainer.style.width = "100%"
        asciiContainer.style.height = "100%"
        asciiContainer.style.overflow = "hidden"

        if (asciiContainer.parentNode !== this.renderRoot) {
            this.renderRoot.appendChild(asciiContainer)
        }

        this.originalCanvasOpacity = canvas.style.opacity || null
        canvas.style.opacity = "0"

        this.asciiEffect = asciiEffect
    }

    private teardownAsciiEffect() {
        if (!this.asciiEffect) {
            return
        }

        this.asciiEffect.destroy()
        this.asciiEffect = null

        if (this.renderer?.domElement && this.originalCanvasOpacity !== null) {
            this.renderer.domElement.style.opacity = this.originalCanvasOpacity
        } else if (this.renderer?.domElement) {
            this.renderer.domElement.style.removeProperty("opacity")
        }
        this.originalCanvasOpacity = null
    }

    // Method called by parent to render ASCII effect
    renderAscii() {
        if (this.asciiEffect && this.scene && this.camera && this.renderer) {
            this.renderer.render(this.scene, this.camera)
            this.asciiEffect.render()
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
            this.asciiEffect.setCharacterSet(this.characters)
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
