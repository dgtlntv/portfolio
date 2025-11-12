import type { CSSResultGroup, PropertyValues } from "lit"
import { css, html } from "lit"
import { customElement } from "lit/decorators.js"
import "./AsciiRenderer"
import type { AsciiRenderer } from "./AsciiRenderer"
import { BaseThreeComponent } from "./BaseThreeComponent"
import "./ProfileModel"
import type { ProfileModel } from "./ProfileModel"

@customElement("three-scene")
export class ThreeScene extends BaseThreeComponent {
    static override styles: CSSResultGroup = [
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
        `,
    ]

    private profileModel: ProfileModel | null = null
    private asciiRenderer: AsciiRenderer | null = null
    private readonly animationCallbacks = new Set<() => void>()

    protected initScene(): void {
        // Base scene remains minimal; move camera slightly forward for better framing
        this.camera.position.z = 5
    }

    protected onFrame(): void {
        this.animationCallbacks.forEach((callback) => callback())
    }

    protected renderScene(): void {
        if (this.asciiRenderer) {
            this.asciiRenderer.renderAscii()
            return
        }

        super.renderScene()
    }

    protected firstUpdated(changedProperties: PropertyValues<this>): void {
        super.firstUpdated(changedProperties)

        this.profileModel =
            (this.shadowRoot?.querySelector(
                "profile-model",
            ) as ProfileModel | null) ?? null
        this.asciiRenderer =
            (this.shadowRoot?.querySelector(
                "ascii-renderer",
            ) as AsciiRenderer | null) ?? null

        if (this.profileModel) {
            this.profileModel.setThreeContext(
                this.scene,
                this.camera,
                (callback: () => void) => this.addAnimationCallback(callback),
            )
        }

        if (this.asciiRenderer) {
            this.asciiRenderer.setThreeContext(
                this.scene,
                this.camera,
                this.renderer,
            )
        }
    }

    private addAnimationCallback(callback: () => void): () => void {
        this.animationCallbacks.add(callback)
        return () => {
            this.animationCallbacks.delete(callback)
        }
    }

    render() {
        return html`
            <profile-model></profile-model>
            <ascii-renderer
                resolution="0.18"
                characters=" .:-+*=%#"
            ></ascii-renderer>
        `
    }
}
