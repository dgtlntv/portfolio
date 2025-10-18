import type { ReactNode } from "react"

export interface WithChildren {
  children: ReactNode
}

export interface ModalContextType {
    openModal: (content: ReactNode, onClose?: () => void) => void
    closeModal: () => void
}

export interface ModalProviderProps extends WithChildren {}

export interface ModalConfig {
    isOpen: boolean
    content: ReactNode | null
    onClose: () => void
}

export interface ModalProps extends WithChildren {
    isOpen: boolean
    onClose: () => void
}
