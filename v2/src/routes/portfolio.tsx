import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/portfolio")({
    component: Portfolio,
})

function Portfolio() {
    return <></>
}
