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
            className={`
                fixed inset-0 z-50 p-0 m-0 w-full h-full 
                flex items-end justify-center
                transition-all duration-300 ease-out
                ${isOpen 
                    ? 'opacity-100' 
                    : 'opacity-0'
                }
            `}
            style={{
                border: "none",
                maxWidth: "none",
                maxHeight: "none",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(2px)",
            }}
        >
            <div 
                className={`
                    transform transition-all duration-300 ease-out w-full
                    ${isOpen 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-full opacity-0'
                    }
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </dialog>
    )
}
