import { WithChildren } from "../../types"

export interface ProjectItemProps extends WithChildren {
    className?: string
    title: string
    imageUrl: string
    url: string
    isLeft?: boolean
}
