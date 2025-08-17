interface ColorPaletteMockupProps {
    className?: string
}

export default function ColorPaletteMockup({
    className = "",
}: ColorPaletteMockupProps) {
    // Base colors in HSL
    const baseColors = [
        { name: "Orange", hsl: { h: 16, s: 82, l: 52 } }, // Canonical orange
        { name: "Green", hsl: { h: 120, s: 60, l: 45 } }, // Canonical green
        { name: "Red", hsl: { h: 353, s: 80, l: 43 } }, // Canonical red
        { name: "Blue", hsl: { h: 210, s: 100, l: 40 } }, // Canonical blue
    ]

    // Generate shades from 100 to 1000
    const generateShades = (baseHsl: { h: number; s: number; l: number }) => {
        const shades = []
        for (let i = 100; i <= 1000; i += 100) {
            // 100 = white (95%), 1000 = black (5%)
            const lightness = 95 - ((i - 100) / 900) * 90 // Scale from 95% to 5%

            shades.push({
                value: i,
                color: `hsl(${baseHsl.h}, ${baseHsl.s}%, ${lightness}%)`,
            })
        }
        return shades
    }

    const shades = generateShades(baseColors[0].hsl) // Get shade values for headers

    return (
        <div className={`relative ${className}`}>
            <div
                className={`not-prose -rotate-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm`}
            >
                {/* Column headers */}
                <div className="mb-3 flex items-center">
                    <div className="w-12 flex-shrink-0"></div>{" "}
                    {/* Empty space for row labels */}
                    <div className="grid flex-1 grid-cols-10 gap-1">
                        {shades.map((shade) => (
                            <div key={shade.value} className="text-center">
                                <span className="font-mono text-[8px] text-gray-500">
                                    {shade.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Color rows */}
                <div className="space-y-3">
                    {baseColors.map((colorFamily) => {
                        const colorShades = generateShades(colorFamily.hsl)

                        return (
                            <div key={colorFamily.name} className="relative">
                                {/* Color family label */}
                                <div className="flex items-center">
                                    <span className="w-12 flex-shrink-0 text-xs font-medium text-gray-600">
                                        {colorFamily.name}
                                    </span>
                                    <div className="grid flex-1 grid-cols-10 gap-1">
                                        {colorShades.map((shade) => (
                                            <div
                                                key={shade.value}
                                                className="group relative"
                                            >
                                                {/* Color swatch */}
                                                <div
                                                    className="aspect-square cursor-pointer rounded border border-gray-200 transition-transform hover:scale-110"
                                                    style={{
                                                        backgroundColor:
                                                            shade.color,
                                                    }}
                                                    title={`${colorFamily.name} ${shade.value}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
