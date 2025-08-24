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
        event: React.MouseEvent<HTMLDialogElement>,
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
            className="backdrop:bg-black/50"
        >
            <div
                className="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 transform transition-transform duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </dialog>
    )
}
