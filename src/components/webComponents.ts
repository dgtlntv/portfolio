export async function registerWebComponents() {
    if (typeof window === "undefined") return
    await import("./Article/ImageGallery.ts")
    await import("./Modal/DevicePermissionModal.ts")
    await import("./Three/ThreeScene.ts")
    await import("./AsciiMedia/AsciiMedia.ts")
    await import("./GitHubCodeExplorer/github-code-explorer.ts")
}
