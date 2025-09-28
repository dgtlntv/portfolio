import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

export class ModelLoader {
    private loader = new STLLoader()
    private cache = new Map<string, THREE.BufferGeometry>()

    async loadSTL(url: string): Promise<THREE.BufferGeometry> {
        // Check cache first
        if (this.cache.has(url)) {
            return this.cache.get(url)!.clone()
        }

        try {
            const geometry = await this.loadSTLFromURL(url)
            this.cache.set(url, geometry)
            return geometry.clone()
        } catch (error) {
            console.error(`Failed to load STL model from ${url}:`, error)
            throw error
        }
    }

    private loadSTLFromURL(url: string): Promise<THREE.BufferGeometry> {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (geometry) => {
                    resolve(geometry)
                },
                (progress) => {
                    // Optional: handle loading progress
                    console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
                },
                (error) => {
                    reject(error)
                }
            )
        })
    }

    clearCache() {
        // Dispose of cached geometries
        this.cache.forEach(geometry => geometry.dispose())
        this.cache.clear()
    }

    dispose() {
        this.clearCache()
    }
}

// Global singleton instance
export const modelLoader = new ModelLoader()