import { useEffect, useRef } from "react"
import { ModalProps } from "./types"

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement | null>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (isOpen) {
            dialog.showModal()
        } else {
            dialog.close()
        }
    }, [isOpen])

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDialogElement>
    ): void => {
        if (event.target === dialogRef.current) {
            onClose()
        }
    }

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            onClick={handleBackdropClick}
            style={{
                padding: "20px",
                maxWidth: "500px",
                width: "100%",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "white",
            }}
        >
            {children}
        </dialog>
    )
}
