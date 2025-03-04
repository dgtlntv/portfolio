import { WithChildren } from "../../types"

export interface PortfolioItemProps extends WithChildren {
    className?: string
    title: string
    imageUrl: string
    url: string
    isLeft?: boolean
}
