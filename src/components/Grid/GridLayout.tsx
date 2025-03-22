import React from "react"

interface GridLayoutProps {
    children: React.ReactNode
    className?: string
}

export default function GridLayout({
    children,
    className = "",
}: GridLayoutProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-9 gap-0 ${className}`}>
            {children}
        </div>
    )
}
