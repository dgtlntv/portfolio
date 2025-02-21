import { FloatRightWrapperProps } from "./types"

export default function FloatRightWrapper({
    children,
}: FloatRightWrapperProps) {
    return <div className="flex flex-col xl:flow-root">{children}</div>
}
