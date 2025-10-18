export async function GET() {
    const isStaging = import.meta.env.STAGING === "true"

    const robotsTxt = isStaging
        ? `User-agent: *\nDisallow: /`
        : `User-agent: *\nAllow: /`

    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
        },
    })
}
