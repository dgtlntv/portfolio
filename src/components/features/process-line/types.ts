export interface ProcessStage {
    label: string
    id: string
    anchor?: string // matches heading ID in the content
    type?: "default" | "branch" | "merge"
    branchFrom?: string
    mergesInto?: string
    style?: {
        loop?: boolean
        pause?: boolean
        dashed?: boolean
        intensity?: number
    }
}
