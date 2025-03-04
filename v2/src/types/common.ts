import { ReactNode } from 'react'
import * as THREE from 'three'

/**
 * Common Props Interface - Base interface for components with children
 */
export interface WithChildren {
  children: ReactNode
}

/**
 * Mouse coordinates in 2D space
 */
export interface Mouse2D {
  x: number
  y: number
}

/**
 * Device orientation tracking interface
 */
export interface Orientation {
  quaternion: THREE.Quaternion | null
}

/**
 * Standard image interface
 */
export interface Image {
  id: string | number
  src: string
  alt: string
  name?: string
}

/**
 * Permission states for device APIs
 */
export type PermissionState = 'granted' | 'denied' | 'prompt'

/**
 * Basic link interface
 */
export interface Link {
  to: string
  label: string
}

/**
 * Key-value stat pair for displaying information
 */
export interface Stat {
  label: string
  value: string | number
}