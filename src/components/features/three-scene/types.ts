export interface WithChildren {
  children: string | HTMLElement | DocumentFragment
}

export interface ModalContextType {
    openModal: (content: string | HTMLElement | DocumentFragment, onClose?: () => void) => void
    closeModal: () => void
}

export interface ModalProviderProps extends WithChildren {}

export interface ModalConfig {
    isOpen: boolean
    content: string | HTMLElement | DocumentFragment | null
    onClose: () => void
}

export interface ModalProps extends WithChildren {
    isOpen: boolean
    onClose: () => void
}
