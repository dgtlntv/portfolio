import * as THREE from "three"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js"

/**
 * Handles loading of STL 3D models
 */
export class ModelLoader {
    private readonly loader: STLLoader

    constructor() {
        this.loader = new STLLoader()
    }

    /**
     * Load an STL model from a URL
     * @param url - The URL of the STL file to load
     * @returns A promise that resolves to the loaded BufferGeometry
     */
    async loadSTL(url: string): Promise<THREE.BufferGeometry> {
        try {
            return await this.loadSTLFromURL(url)
        } catch (error) {
            throw new Error(`Failed to load STL model from ${url}: ${error}`)
        }
    }

    /**
     * Load geometry from URL using STLLoader
     * @param url - The URL of the STL file to load
     * @returns A promise that resolves to the loaded BufferGeometry
     * @private
     */
    private loadSTLFromURL(url: string): Promise<THREE.BufferGeometry> {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (geometry) => resolve(geometry),
                undefined,
                (error) => reject(error),
            )
        })
    }
}

export const modelLoader = new ModelLoader()
