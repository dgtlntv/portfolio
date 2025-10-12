export async function registerWebComponents() {
    if (typeof window === "undefined") return
    await import("../components/Content/Image/ImageGallery.ts")
    await import("../components/Modal/DevicePermissionModal.ts")
    await import("../components/Layout/Navigation/MobileMenuDialog.ts")
    await import("../components/Three/ThreeScene.ts")
    await import("../components/AsciiMedia/AsciiMedia.ts")
    await import("../components/Content/Embeds/GitHubCodeExplorer/github-code-explorer.ts")
}
