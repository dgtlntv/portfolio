import { ReactNode } from "react"

export interface ModalContextType {
    openModal: (content: ReactNode, onClose?: () => void) => void
    closeModal: () => void
}

export interface ModalProviderProps {
    children: ReactNode
}

export interface ModalConfig {
    isOpen: boolean
    content: ReactNode | null
    onClose: () => void
}

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}
