import { FloatRightFigureProps } from "./types"

export default function FloatRightFigure({ children }: FloatRightFigureProps) {
    return (
        <div className="mx-auto xl:float-right xl:mx-0 xl:mb-0 xl:-mr-60 xl:max-w-xl xl:pl-8 xl:pb-8">
            <figure>{children}</figure>
        </div>
    )
}
