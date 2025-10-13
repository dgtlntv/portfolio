import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { BaseThreeComponent } from './BaseThreeComponent'
import './ProfileModel'
import './AsciiRenderer'

@customElement('three-scene')
export class ThreeScene extends BaseThreeComponent {
    static styles = [
        BaseThreeComponent.styles,
        css`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                position: relative;
            }

            profile-model {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
            }

            ascii-renderer {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
                pointer-events: none;
            }
        `
    ]

    private profileModel?: any
    private asciiRenderer?: any
    private animationCallbacks: (() => void)[] = []

    protected initScene(): void {
        // The scene setup is minimal since ProfileModel handles most content
        // Just ensure proper camera positioning
        this._camera.position.z = 5
    }

    protected onFrame(): void {
        // Call all registered animation callbacks (for ProfileModel)
        this.animationCallbacks.forEach(callback => callback())
        
        // ASCII renderer takes over the actual rendering (like React useFrame with renderIndex)
        if (this.asciiRenderer) {
            this.asciiRenderer.renderAscii()
        } else {
            // Fallback: render normally if no ASCII renderer
            this._renderer.render(this._scene, this._camera)
        }
    }

    protected firstUpdated() {
        super.firstUpdated()
        
        // Get references to child components
        this.profileModel = this.shadowRoot?.querySelector('profile-model')
        this.asciiRenderer = this.shadowRoot?.querySelector('ascii-renderer')

        // Set up ProfileModel with Three.js context
        if (this.profileModel && this._scene && this._camera) {
            this.profileModel.setThreeContext(
                this._scene, 
                this._camera, 
                (callback: () => void) => this.addAnimationCallback(callback)
            )
        }

        // Set up AsciiRenderer with Three.js context
        if (this.asciiRenderer && this._scene && this._camera && this._renderer) {
            this.asciiRenderer.setThreeContext(this._scene, this._camera, this._renderer)
        }
    }

    private addAnimationCallback(callback: () => void) {
        this.animationCallbacks.push(callback)
    }

    render() {
        return html`
            <profile-model></profile-model>
            <ascii-renderer resolution="0.18" characters=" .:-+*=%#"></ascii-renderer>
        `
    }
}