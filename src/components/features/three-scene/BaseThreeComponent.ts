import type { CSSResultGroup, PropertyValues } from "lit"
import { LitElement, css, html } from "lit"
import { property } from "lit/decorators.js"
import * as THREE from "three"

export abstract class BaseThreeComponent extends LitElement {
    static styles: CSSResultGroup = css`
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
    width = 0

    @property({ type: Number })
    height = 0

    protected scene!: THREE.Scene
    protected camera!: THREE.PerspectiveCamera
    protected renderer!: THREE.WebGLRenderer

    private frameId: number | null = null
    private resizeObserver: ResizeObserver | null = null
    private isAnimating = false

    connectedCallback(): void {
        super.connectedCallback()
        this.initThree()
    }

    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.teardown()
    }

    protected firstUpdated(changedProperties: PropertyValues<this>): void {
        super.firstUpdated(changedProperties)

        if (this.renderer) {
            const canvas = this.renderer.domElement
            if (!canvas.isConnected) {
                this.renderRoot.appendChild(canvas)
            }
        }

        this.startAnimation()
    }

    private initThree(): void {
        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        this.camera.position.set(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.domElement.style.display = "block"

        const { width, height } = this.getHostSize()
        this.updateRendererSize(width, height)

        this.initScene()
        this.setupResizeObserver()
    }

    private getHostSize(): { width: number; height: number } {
        const rect = this.getBoundingClientRect()
        const width = Math.max(
            1,
            Math.floor(rect.width || this.clientWidth || 1),
        )
        const height = Math.max(
            1,
            Math.floor(rect.height || this.clientHeight || 1),
        )
        return { width, height }
    }

    private setupResizeObserver(): void {
        this.disposeResizeObserver()

        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect
                if (width > 0 && height > 0) {
                    this.updateRendererSize(width, height)
                }
            }
        })

        this.resizeObserver.observe(this as Element)
    }

    private disposeResizeObserver(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect()
            this.resizeObserver = null
        }
    }

    private updateRendererSize(width: number, height: number): void {
        this.width = width
        this.height = height

        if (this.camera) {
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
        }

        if (this.renderer) {
            this.renderer.setSize(width, height, false)
        }

        this.onResize(width, height)
    }

    protected startAnimation(): void {
        if (this.isAnimating) {
            return
        }

        this.isAnimating = true
        this.tick()
    }

    protected stopAnimation(): void {
        this.isAnimating = false

        if (this.frameId !== null) {
            cancelAnimationFrame(this.frameId)
            this.frameId = null
        }
    }

    private tick = (): void => {
        if (!this.isAnimating) {
            return
        }

        this.frameId = requestAnimationFrame(this.tick)
        this.onFrame()
        this.renderScene()
    }

    protected renderScene(): void {
        this.renderer.render(this.scene, this.camera)
    }

    private teardown(): void {
        this.stopAnimation()
        this.disposeResizeObserver()

        if (this.scene) {
            this.scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry?.dispose()

                    if (Array.isArray(object.material)) {
                        object.material.forEach((material) =>
                            material.dispose(),
                        )
                    } else {
                        object.material?.dispose()
                    }
                }
            })
        }

        this.renderer?.dispose()
        this.onCleanup()
    }

    protected abstract initScene(): void
    protected abstract onFrame(): void

    protected onResize(_width: number, _height: number): void {}
    protected onCleanup(): void {}

    getScene(): THREE.Scene {
        return this.scene
    }

    getCamera(): THREE.Camera {
        return this.camera
    }

    getRenderer(): THREE.WebGLRenderer {
        return this.renderer
    }

    render() {
        return html`<slot></slot>`
    }
}
