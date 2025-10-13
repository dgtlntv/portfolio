export async function registerWebComponents() {
    if (typeof window === "undefined") return
    await import("../components/ui/images/ImageGallery.ts")
    await import("../components/features/three-scene/DevicePermissionModal.ts")
    await import("../components/layout/navigation/MobileMenuDialog.ts")
    await import("../components/features/three-scene/ThreeScene.ts")
    await import("../components/features/ascii-media/AsciiMedia.ts")
    await import(
        "../components/features/github-code-explorer/github-code-explorer.ts"
    )
}
