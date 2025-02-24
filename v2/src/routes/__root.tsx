import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router"
import Footer from "../components/Footer"
import Navigation from "../components/Navigation/Navigation"

export const Route = createRootRoute({
    component: () => {
        const { location } = useRouterState()
        const isRootPath = location.pathname === "/" || location.pathname === ""

        return (
            <div>
                <Navigation />
                <div className="relativ">
                    <Outlet />
                </div>
                {!isRootPath && <Footer />}
            </div>
        )
    },
})
