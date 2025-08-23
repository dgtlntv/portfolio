import { createContext, ReactNode, useContext, useState } from "react"
import Modal from "./Modal"
import { ModalConfig, ModalContextType, ModalProviderProps } from "./types"

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: ModalProviderProps) {
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        isOpen: false,
        content: null,
        onClose: () => {},
    })

    const openModal = (
        content: ReactNode,
        onClose: () => void = () => {}
    ): void => {
        setModalConfig({
            isOpen: true,
            content,
            onClose,
        })
    }

    const closeModal = (): void => {
        modalConfig.onClose()
        setModalConfig((prev) => ({
            ...prev,
            isOpen: false,
        }))
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Modal isOpen={modalConfig.isOpen} onClose={closeModal}>
                {modalConfig.content}
            </Modal>
        </ModalContext.Provider>
    )
}

export function useModal(): ModalContextType {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider")
    }
    return context
}
