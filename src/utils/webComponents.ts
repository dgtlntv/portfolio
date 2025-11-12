type ComponentLoader = {
    selectors: string[]
    loader: () => Promise<unknown>
}

const ALWAYS_LOADED_COMPONENTS: Array<() => Promise<unknown>> = [
    () => import("../components/layout/Navigation/MobileMenuDialog.ts"),
]

const CONDITIONAL_COMPONENTS: ComponentLoader[] = [
    {
        selectors: ["image-gallery"],
        loader: () => import("../components/ui/images/ImageGallery.ts"),
    },
    {
        selectors: ["three-scene"],
        loader: () =>
            import("../components/features/three-scene/ThreeScene.ts"),
    },
    {
        selectors: ["ascii-media"],
        loader: () =>
            import("../components/features/ascii-media/AsciiMedia.ts"),
    },
    {
        selectors: ["github-code-explorer"],
        loader: () =>
            import(
                "../components/features/github-code-explorer/github-code-explorer.ts"
            ),
    },
]

export async function registerWebComponents(scope?: ParentNode) {
    if (typeof window === "undefined") return

    const target = scope ?? document

    await Promise.all(ALWAYS_LOADED_COMPONENTS.map((loader) => loader()))

    const conditionalLoads = CONDITIONAL_COMPONENTS.filter(({ selectors }) =>
        selectors.some((selector) => target.querySelector(selector) !== null),
    ).map(({ loader }) => loader())

    if (conditionalLoads.length > 0) {
        await Promise.all(conditionalLoads)
    }
}
