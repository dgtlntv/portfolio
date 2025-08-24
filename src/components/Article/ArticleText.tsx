import { ArticleTextProps } from "./types"

export default function ArticleText({ children }: ArticleTextProps) {
    return (
        <div className="prose prose-lg prose-red mx-auto mt-16 marker:text-red-500">
            {children}
        </div>
    )
}
