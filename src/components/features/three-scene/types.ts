import type { ReactNode } from "react"
import type { WithChildren } from "../../../types"

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
