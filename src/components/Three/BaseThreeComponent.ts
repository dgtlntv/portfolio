import { LitElement, html, css } from 'lit'
import { property } from 'lit/decorators.js'
import * as THREE from 'three'

export abstract class BaseThreeComponent extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
        }

        canvas {
            display: block;
        }
    `

    @property({ type: Number })
    width: number = 0

    @property({ type: Number })
    height: number = 0

    protected _scene!: THREE.Scene
    protected _camera!: THREE.PerspectiveCamera
    protected _renderer!: THREE.WebGLRenderer
    protected animationId?: number
    protected resizeObserver?: ResizeObserver
    protected isAnimating = false

    connectedCallback() {
        super.connectedCallback()
        this.initThree()
        this.setupResizeObserver()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.cleanup()
    }

    private initThree() {
        // Create scene
        this._scene = new THREE.Scene()

        // Create camera
        this._camera = new THREE.PerspectiveCamera(
            75,
            this.clientWidth / this.clientHeight,
            0.1,
            1000
        )

        // Create renderer
        this._renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        })
        this._renderer.setSize(this.clientWidth, this.clientHeight)
        this._renderer.setPixelRatio(window.devicePixelRatio)

        // Allow subclasses to initialize their specific setup
        this.initScene()
    }

    private setupResizeObserver() {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                this.handleResize(width, height)
            }
        })
        this.resizeObserver.observe(this)
    }

    private handleResize(width: number, height: number) {
        if (width === 0 || height === 0) return

        this.width = width
        this.height = height

        this._camera.aspect = width / height
        this._camera.updateProjectionMatrix()
        this._renderer.setSize(width, height)

        this.onResize(width, height)
    }

    protected startAnimation() {
        if (this.isAnimating) return
        this.isAnimating = true
        this.animate()
    }

    protected stopAnimation() {
        this.isAnimating = false
        if (this.animationId) {
            cancelAnimationFrame(this.animationId)
            this.animationId = undefined
        }
    }

    private animate = () => {
        if (!this.isAnimating) return

        this.animationId = requestAnimationFrame(this.animate)
        this.onFrame()
        this._renderer.render(this._scene, this._camera)
    }

    private cleanup() {
        this.stopAnimation()
        
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
        }

        // Dispose of Three.js resources
        this._scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.geometry?.dispose()
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose())
                } else {
                    object.material?.dispose()
                }
            }
        })

        this._renderer?.dispose()
        this.onCleanup()
    }

    protected firstUpdated() {
        super.firstUpdated()
        if (this._renderer) {
            const canvas = this._renderer.domElement
            this.shadowRoot?.appendChild(canvas)
        }
        this.startAnimation()
    }

    // Abstract methods for subclasses to implement
    protected abstract initScene(): void
    protected abstract onFrame(): void

    // Optional hooks for subclasses
    protected onResize(width: number, height: number): void {}
    protected onCleanup(): void {}

    // Getters for child components to access Three.js objects
    get scene() { return this._scene }
    get camera() { return this._camera }
    get renderer() { return this._renderer }

    render() {
        return html`<slot></slot>`
    }
}