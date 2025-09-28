// Central registry for all web components
// This file should only be imported client-side

export async function registerWebComponents() {
    if (typeof window === "undefined") return

    // Import and register ImageGallery
    await import("./Article/ImageGallery.ts")

    // Future web components can be added here
    // await import('./SomeOtherComponent.ts');
}
