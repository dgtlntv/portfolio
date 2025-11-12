import { LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"
import * as THREE from "three"
import {
    deviceOrientationTracker,
    type Orientation,
} from "../../../utils/deviceOrientationTracker"
import { modelLoader } from "../../../utils/modelLoader"
import { mouseTracker, type Mouse2D } from "../../../utils/mouseTracker"

@customElement("profile-model")
export class ProfileModel extends LitElement {
    @property({ type: String })
    modelPath = "/profile_febfp5.stl"

    // Properties set by parent ThreeScene
    private scene?: THREE.Scene
    private registerAnimationCallback?: (callback: () => void) => () => void
    private unregisterAnimationCallback?: () => void

    private model?: THREE.Mesh
    private modelGroup?: THREE.Group
    private centerGroup?: THREE.Group
    private directionalLight?: THREE.DirectionalLight
    private unsubscribeMouse?: () => void
    private unsubscribeOrientation?: () => void
    private currentMouse: Mouse2D = { x: 0, y: 0 }
    private currentOrientation: Orientation = { quaternion: null }

    // Method called by parent to set Three.js context
    setThreeContext(
        scene: THREE.Scene,
        _camera: THREE.Camera,
        animationCallback: (callback: () => void) => () => void,
    ) {
        if (this.scene && this.scene !== scene) {
            this.cleanup()
        }

        this.scene = scene
        this.registerAnimationCallback = animationCallback
        this.unregisterAnimationCallback?.()
        this.unregisterAnimationCallback = this.registerAnimationCallback?.(
            () => this.onFrame(),
        )
        this.initModel()
    }

    private initModel(): void {
        if (!this.scene || this.centerGroup) return

        // Add lighting
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.set(-2, 6, 6)
        this.scene.add(this.directionalLight)

        // Create group hierarchy to match original structure
        this.centerGroup = new THREE.Group()
        this.modelGroup = new THREE.Group()
        this.centerGroup.add(this.modelGroup)
        this.scene.add(this.centerGroup)

        // Load the model
        this.loadModel()

        // Subscribe to input trackers
        this.setupInputTracking()
    }

    private async loadModel() {
        try {
            const geometry = await modelLoader.loadSTL(this.modelPath)

            // Create material matching the original
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                flatShading: true,
            })

            // Create mesh
            this.model = new THREE.Mesh(geometry, material)

            // Apply transformations to match original (before centering)
            this.model.position.set(2, 2, 1.5)
            this.model.rotation.set(-Math.PI / 2, -0.01, Math.PI / 2)
            this.model.scale.setScalar(13)

            this.modelGroup?.add(this.model)

            // Center the entire group (like React-Three-Fiber's <Center> component)
            this.centerModelGroup()
        } catch (error) {
            console.error("Failed to load profile model:", error)
            // Create fallback geometry (box) in case of loading failure
            this.createFallbackModel()
        }
    }

    private createFallbackModel() {
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            flatShading: true,
        })

        this.model = new THREE.Mesh(geometry, material)
        this.model.position.set(2, 2, 1.5)
        this.model.rotation.set(-Math.PI / 2, -0.01, Math.PI / 2)
        this.model.scale.setScalar(13)

        this.modelGroup?.add(this.model)

        // Center the entire group (like React-Three-Fiber's <Center> component)
        this.centerModelGroup()
    }

    private centerModelGroup() {
        if (!this.modelGroup) return

        // Calculate bounding box of the entire group
        const box = new THREE.Box3().setFromObject(this.modelGroup)
        const center = box.getCenter(new THREE.Vector3())

        // Move the group so its center is at origin
        this.modelGroup.position.sub(center)
    }

    private setupInputTracking() {
        // Reset previous subscriptions before establishing new ones
        this.unsubscribeMouse?.()
        this.unsubscribeOrientation?.()

        // Subscribe to mouse tracking
        this.unsubscribeMouse = mouseTracker.subscribe((mouse) => {
            this.currentMouse = mouse
        })

        // Subscribe to device orientation tracking
        this.unsubscribeOrientation = deviceOrientationTracker.subscribe(
            (orientation) => {
                this.currentOrientation = orientation
            },
        )
    }

    private onFrame(): void {
        if (!this.centerGroup) return

        // Apply rotation based on device orientation or mouse input
        if (this.currentOrientation.quaternion !== null) {
            this.centerGroup.setRotationFromQuaternion(
                this.currentOrientation.quaternion,
            )
        } else {
            // Fallback to mouse control
            this.centerGroup.rotation.x = -this.currentMouse.y * 0.2
            this.centerGroup.rotation.y = this.currentMouse.x * 0.2
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.cleanup()
    }

    private cleanup(): void {
        // Unsubscribe from trackers
        this.unsubscribeMouse?.()
        this.unsubscribeOrientation?.()
        this.unregisterAnimationCallback?.()

        // Remove objects from scene
        if (this.scene && this.centerGroup) {
            this.scene.remove(this.centerGroup)
        }

        if (this.scene && this.directionalLight) {
            this.scene.remove(this.directionalLight)
        }

        // Dispose of model resources
        if (this.model) {
            this.model.geometry?.dispose()
            if (Array.isArray(this.model.material)) {
                this.model.material.forEach((material) => material.dispose())
            } else {
                this.model.material?.dispose()
            }
        }

        this.model = undefined
        this.modelGroup = undefined
        this.centerGroup = undefined
        this.directionalLight = undefined
    }

    render() {
        // This component has no visual output - it just manages 3D objects
        return null
    }
}
